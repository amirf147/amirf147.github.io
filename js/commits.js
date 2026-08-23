/**
 * ============================================================================
 * GitHub Commits Module
 * Fetches recent public commits with caching, CI/CD status resolution,
 * skeleton states, and rate limiting.
 * Compatible with local file:// protocol and https:// GitHub Pages.
 * ============================================================================
 */

class CommitsFeed {
    constructor() {
        this.commitsContainer = document.getElementById('commits-feed-container');
        this.refreshBtn = document.getElementById('refresh-commits-btn');
        this.refreshIcon = this.refreshBtn ? this.refreshBtn.querySelector('.refresh-icon') : null;

        this.CACHE_KEY = 'amir_recent_commits_feed';
        this.CACHE_TIME_KEY = 'amir_recent_commits_feed_time';
        this.CI_CACHE_KEY = 'amir_commits_ci_cache_v1';
        this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes

        this.isCooldown = false;

        this.init();
    }

    init() {
        if (!this.commitsContainer) return;

        this.loadCommits();

        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                if (this.isCooldown) return;
                this.loadCommits(true);
                this.startRefreshCooldown();
            });
        }
    }

    getCiCache() {
        try {
            const raw = localStorage.getItem(this.CI_CACHE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    setCiCache(cache) {
        try {
            const keys = Object.keys(cache);
            if (keys.length > 100) {
                const trimmed = {};
                keys.slice(keys.length - 100).forEach(k => {
                    trimmed[k] = cache[k];
                });
                localStorage.setItem(this.CI_CACHE_KEY, JSON.stringify(trimmed));
            } else {
                localStorage.setItem(this.CI_CACHE_KEY, JSON.stringify(cache));
            }
        } catch (e) {
            console.warn('Failed to save CI cache:', e);
        }
    }

    parseCiStatus(checkRunsData, repoFullName, sha) {
        if (!checkRunsData || typeof checkRunsData.total_count !== 'number') {
            return null;
        }

        if (checkRunsData.total_count === 0) {
            return { hasCi: false };
        }

        const runs = checkRunsData.check_runs || [];
        const hasRunning = runs.some(r => r.status === 'in_progress' || r.status === 'queued' || r.status === 'waiting');
        const hasFailure = runs.some(r => r.conclusion === 'failure' || r.conclusion === 'timed_out' || r.conclusion === 'action_required' || r.conclusion === 'cancelled');

        let state = 'success';
        let label = 'CI/CD: all checks passed';
        let icon = '✔';
        let ariaLabel = 'CI/CD Status: All checks passed';

        if (hasRunning) {
            state = 'running';
            label = 'CI/CD: running checks';
            icon = '↻';
            ariaLabel = 'CI/CD Status: Running checks';
        } else if (hasFailure) {
            state = 'review';
            label = 'CI/CD: pipeline review';
            icon = '●';
            ariaLabel = 'CI/CD Status: Pipeline review';
        } else {
            state = 'success';
            label = 'CI/CD: all checks passed';
            icon = '✔';
            ariaLabel = 'CI/CD Status: All checks passed';
        }

        const url = runs[0]?.html_url || `https://github.com/${repoFullName}/commit/${sha}/checks`;

        return {
            hasCi: true,
            state,
            label,
            icon,
            ariaLabel,
            url,
            isImmutable: !hasRunning
        };
    }

    generateCiBadgeHtml(ciInfo) {
        if (!ciInfo || !ciInfo.hasCi) return '';
        const { state, label, icon, ariaLabel, url } = ciInfo;
        return `
            <a href="${url}" target="_blank" class="commit-ci-badge commit-ci-${state}" aria-label="${ariaLabel} (opens in a new tab)">
                <span class="commit-ci-icon" aria-hidden="true">${icon}</span>
                <span class="commit-ci-text">${label}</span>
                <span class="sr-only"> (opens in a new tab)</span>
            </a>
        `;
    }

    getRelativeTimeString(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        if (isNaN(date.getTime())) return '';
        if (diffDays > 30) {
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHr > 0) {
            return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
        } else if (diffMin > 0) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    }

    renderSkeletons() {
        if (!this.commitsContainer) return;
        let skeletonHtml = '<div class="skeleton-loader">';
        for (let i = 0; i < 5; i++) {
            skeletonHtml += `
                <div class="skeleton-row">
                    <div style="display: flex; flex-direction: column; gap: 8px; width: 60%;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="skeleton-bar" style="width: 130px; height: 12px;"></div>
                            <div class="skeleton-bar" style="width: 80px; height: 14px; border-radius: 4px;"></div>
                        </div>
                        <div class="skeleton-bar" style="width: 90%; height: 14px;"></div>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div class="skeleton-bar" style="width: 60px; height: 20px;"></div>
                        <div class="skeleton-bar" style="width: 80px; height: 12px;"></div>
                    </div>
                </div>
            `;
        }
        skeletonHtml += '</div>';
        this.commitsContainer.innerHTML = skeletonHtml;
    }

    renderCommits(items) {
        if (!this.commitsContainer) return;
        if (!items || items.length === 0) {
            this.commitsContainer.innerHTML = `
                <div class="commits-error-container">
                    <p class="commits-error-text">No recent public commits found.</p>
                </div>
            `;
            return;
        }

        const ciCache = this.getCiCache();
        let html = '<div id="commits-wrapper" class="commits-feed-wrapper"><ul class="commits-list">';
        const limit = Math.min(items.length, 15);
        for (let i = 0; i < limit; i++) {
            const item = items[i];
            const sha = item.sha ? item.sha.substring(0, 7) : '';
            const fullSha = item.sha || '';
            const commitUrl = item.html_url || '';
            const repoFullName = item.repository ? item.repository.full_name : '';
            const repoUrl = item.repository ? item.repository.html_url : '';
            const commitMsg = item.commit && item.commit.message ? item.commit.message.split('\n')[0] : 'No commit message';
            const commitDate = item.commit && item.commit.committer ? item.commit.committer.date : '';
            const relativeTime = this.getRelativeTimeString(commitDate);

            const cacheKey = `${repoFullName}@${fullSha}`;
            const cachedCi = ciCache[cacheKey];
            const ciBadgeHtml = cachedCi ? this.generateCiBadgeHtml(cachedCi) : '';

            html += `
                <li class="commit-item">
                    <div class="commit-info">
                        <div class="commit-meta">
                            <a href="${repoUrl}" target="_blank" class="commit-repo" aria-label="Repository ${repoFullName} (opens in a new tab)">
                                ${repoFullName}
                            </a>
                            <span class="commit-ci-container" data-ci-key="${cacheKey}">${ciBadgeHtml}</span>
                        </div>
                        <a href="${commitUrl}" target="_blank" class="commit-message-link" title="${commitMsg.replace(/"/g, '&quot;')}" aria-label="Commit: ${commitMsg.replace(/"/g, '&quot;')} (opens in a new tab)">
                            ${commitMsg}
                        </a>
                    </div>
                    <div class="commit-right-side">
                        <a href="${commitUrl}" target="_blank" class="commit-sha-badge" aria-label="Commit SHA ${sha} (opens in a new tab)">
                            ${sha}
                        </a>
                        <time class="commit-time-elapsed" datetime="${commitDate}">${relativeTime}</time>
                    </div>
                </li>
            `;
        }
        html += '</ul></div>';

        if (limit > 5) {
            html += `
                <div class="commits-expand-row">
                    <button id="toggle-commits-expand-btn" class="nav-btn btn-sm" aria-expanded="false" aria-controls="commits-wrapper" aria-label="Show more recent commits" data-tooltip="Expand to view all ${limit} recent commits" data-tooltip-pos="top">
                        Show More Commits
                    </button>
                </div>
            `;
        }

        this.commitsContainer.innerHTML = html;

        if (limit > 5) {
            const toggleBtn = document.getElementById('toggle-commits-expand-btn');
            const wrapper = document.getElementById('commits-wrapper');
            if (toggleBtn && wrapper) {
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = wrapper.classList.toggle('is-expanded');
                    toggleBtn.textContent = isExpanded ? 'Show Less' : 'Show More Commits';
                    toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
                    toggleBtn.setAttribute('aria-label', isExpanded ? 'Show fewer recent commits' : 'Show more recent commits');
                    toggleBtn.setAttribute('data-tooltip', isExpanded ? 'Collapse commit feed view' : `Expand to view all ${limit} recent commits`);
                });
            }
        }

        // Asynchronously resolve any missing or in-progress CI statuses
        this.resolveMissingCiStatuses(items);
    }

    async resolveMissingCiStatuses(items) {
        const ciCache = this.getCiCache();
        const uncachedItems = [];
        const limit = Math.min(items.length, 15);

        for (let i = 0; i < limit; i++) {
            const item = items[i];
            if (!item.repository || !item.sha) continue;
            const repoFullName = item.repository.full_name;
            const sha = item.sha;
            const cacheKey = `${repoFullName}@${sha}`;

            if (!ciCache[cacheKey] || ciCache[cacheKey].state === 'running') {
                uncachedItems.push({ repoFullName, sha, cacheKey });
            }
        }

        if (uncachedItems.length === 0) return;

        // Process in small parallel batches to avoid throttling
        const batchSize = 3;
        for (let i = 0; i < uncachedItems.length; i += batchSize) {
            const batch = uncachedItems.slice(i, i + batchSize);
            let hitRateLimit = false;

            await Promise.allSettled(batch.map(async ({ repoFullName, sha, cacheKey }) => {
                try {
                    const response = await fetch(`https://api.github.com/repos/${repoFullName}/commits/${sha}/check-runs`, {
                        headers: {
                            'Accept': 'application/vnd.github+json'
                        }
                    });

                    if (!response.ok) {
                        if (response.status === 404 || response.status === 422) {
                            ciCache[cacheKey] = { hasCi: false };
                            this.setCiCache(ciCache);
                        } else if (response.status === 403 || response.status === 429) {
                            hitRateLimit = true;
                        }
                        return;
                    }

                    const data = await response.json();
                    const ciInfo = this.parseCiStatus(data, repoFullName, sha);
                    if (ciInfo) {
                        ciCache[cacheKey] = ciInfo;
                        this.setCiCache(ciCache);

                        const container = document.querySelector(`[data-ci-key="${cacheKey}"]`);
                        if (container) {
                            container.innerHTML = this.generateCiBadgeHtml(ciInfo);
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to resolve CI for ${cacheKey}:`, err);
                }
            }));

            if (hitRateLimit) {
                console.warn('GitHub check-runs rate limit reached; pausing further CI status lookups.');
                break;
            }
        }
    }

    renderError(err) {
        if (!this.commitsContainer) return;
        console.error('Error loading commits:', err);
        this.commitsContainer.innerHTML = `
            <div class="commits-error-container">
                <p class="commits-error-text">Failed to load live commits feed due to rate limiting or network issues.</p>
                <a href="https://github.com/search?q=author%3Aamirf147&type=commits&s=committer-date&o=desc" target="_blank" class="commits-error-link" aria-label="View commits on GitHub (opens in a new tab)">
                    View commits on GitHub directly →
                </a>
            </div>
        `;
    }

    async loadCommits(forceRefresh = false) {
        if (this.refreshIcon) this.refreshIcon.classList.add('spinning');
        if (this.refreshBtn) this.refreshBtn.disabled = true;

        const cachedData = localStorage.getItem(this.CACHE_KEY);
        const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);
        const now = Date.now();

        if (!cachedData || forceRefresh) {
            this.renderSkeletons();
        }

        try {
            if (!forceRefresh && cachedData && cachedTime && (now - parseInt(cachedTime) < this.CACHE_TTL)) {
                this.renderCommits(JSON.parse(cachedData));
                if (this.refreshIcon) this.refreshIcon.classList.remove('spinning');
                if (this.refreshBtn) this.refreshBtn.disabled = false;
                return;
            }

            const response = await fetch('https://api.github.com/search/commits?q=author:amirf147&sort=committer-date&order=desc', {
                headers: {
                    'Accept': 'application/vnd.github+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error! Status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data.items));
            localStorage.setItem(this.CACHE_TIME_KEY, now.toString());
            this.renderCommits(data.items);
        } catch (err) {
            if (cachedData) {
                console.warn('API error, falling back to cached commits data:', err);
                this.renderCommits(JSON.parse(cachedData));
            } else {
                this.renderError(err);
            }
        } finally {
            if (this.refreshIcon) this.refreshIcon.classList.remove('spinning');
            if (this.refreshBtn && !this.isCooldown) this.refreshBtn.disabled = false;
        }
    }

    startRefreshCooldown() {
        this.isCooldown = true;
        let secondsLeft = 60;
        if (this.refreshBtn) {
            this.refreshBtn.disabled = true;
            this.refreshBtn.style.cursor = 'not-allowed';
            this.refreshBtn.setAttribute('data-tooltip', 'GitHub API rate limit cooldown to prevent throttling.');
        }

        const textSpan = this.refreshBtn ? this.refreshBtn.querySelector('.refresh-text') : null;
        if (textSpan) textSpan.textContent = `Wait ${secondsLeft}s`;

        const interval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
                clearInterval(interval);
                this.isCooldown = false;
                if (this.refreshBtn) {
                    this.refreshBtn.disabled = false;
                    this.refreshBtn.style.cursor = '';
                    this.refreshBtn.setAttribute('data-tooltip', 'Fetch latest live commits');
                }
                if (textSpan) textSpan.textContent = 'Refresh';
            } else {
                if (textSpan) textSpan.textContent = `Wait ${secondsLeft}s`;
            }
        }, 1000);
    }
}

window.CommitsFeed = CommitsFeed;
