/**
 * ============================================================================
 * GitHub Commits Module
 * Fetches recent public commits with caching, skeleton states, and rate limiting.
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
                        <div class="skeleton-bar" style="width: 40%; height: 10px;"></div>
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

        let html = '<div id="commits-wrapper" class="commits-feed-wrapper"><ul class="commits-list">';
        const limit = Math.min(items.length, 15);
        for (let i = 0; i < limit; i++) {
            const item = items[i];
            const sha = item.sha ? item.sha.substring(0, 7) : '';
            const commitUrl = item.html_url || '';
            const repoFullName = item.repository ? item.repository.full_name : '';
            const repoUrl = item.repository ? item.repository.html_url : '';
            const commitMsg = item.commit && item.commit.message ? item.commit.message.split('\n')[0] : 'No commit message';
            const commitDate = item.commit && item.commit.committer ? item.commit.committer.date : '';
            const relativeTime = this.getRelativeTimeString(commitDate);

            html += `
                <li class="commit-item">
                    <div class="commit-info">
                        <div class="commit-meta">
                            <a href="${repoUrl}" target="_blank" class="commit-repo" aria-label="Repository ${repoFullName} (opens in a new tab)">
                                ${repoFullName}
                            </a>
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
