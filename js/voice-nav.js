/**
 * ============================================================================
 * Voice Navigation & HUD Overlay Module
 * Cross-Browser Voice Engine with Dual Mode:
 *   Mode 1: Native Web Speech Recognition (Chrome, Edge, Safari, Brave, Opera)
 *   Mode 2: Lightweight In-Browser Neural Engine (Firefox, Waterfox & Unsupported Browsers)
 * Senior Voice UX (VUI) feedback with real-time waveform equalizer,
 * tactile chimes, ARIA live announcements, and hands-free command execution.
 * Compatible with local development and https:// GitHub Pages.
 * ============================================================================
 */

class VoiceNav {
    constructor() {
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
        this.isGecko = ua.includes('firefox') || ua.includes('waterfox') || ua.includes('librewolf') || ua.includes('floorp') || ua.includes('zen') || ua.includes('gecko/');

        // Chromium/Safari use native cloud STT; Gecko (Firefox/Waterfox) uses in-browser neural engine
        this.SpeechRecognition = !this.isGecko ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
        this.hasNativeSpeech = !!this.SpeechRecognition;
        this.hasMediaDevices = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        this.isSupported = this.hasNativeSpeech || this.hasMediaDevices;
        this.engineMode = this.hasNativeSpeech ? 'native' : (this.hasMediaDevices ? 'in-browser' : 'none');

        // Native recognition state
        this.recognition = null;

        // In-Browser Neural Engine state
        this.tfRecognizer = null;
        this.isLoadingModel = false;
        this.micPermissionGranted = false;
        this.audioCtx = null;

        // Global states (Always start off until user initiates gesture)
        this.isListening = false;
        this.shouldBeListening = false;
        this.toastTimeout = null;
        this.currentActiveSection = '';
        this.lastTargetElement = null;

        this.applyAudioContextSampleRateFix();
        this.init();
    }

    applyAudioContextSampleRateFix() {
        if (typeof window === 'undefined') return;
        if (window.__voiceNavAudioContextPatched) return;

        const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
        if (!NativeAudioContext) return;

        const isGecko = /firefox|waterfox|librewolf|floorp|zen/i.test(navigator.userAgent);
        if (isGecko) {
            window.__voiceNavAudioContextPatched = true;
            // In Gecko (Firefox/Waterfox), creating AudioContext with a hardcoded sampleRate (e.g. 44100)
            // causes createMediaStreamSource(stream) to fail with NotSupportedError if the hardware mic
            // is running at 48000 Hz. Instantiating with the system default rate resolves this seamlessly.
            class GeckoSafeAudioContext extends NativeAudioContext {
                constructor(options) {
                    if (options && options.sampleRate) {
                        try {
                            super();
                            return;
                        } catch (e) {}
                    }
                    super(options);
                }
            }
            window.AudioContext = GeckoSafeAudioContext;
            if (window.webkitAudioContext) {
                window.webkitAudioContext = GeckoSafeAudioContext;
            }
        }
    }

    init() {
        this.mountHUD();
        this.setupEventListeners();
        this.setupScrollSpy();

        if (!this.isSupported) {
            this.setUnsupportedState();
            return;
        }

        if (this.engineMode === 'native') {
            this.setupNativeSpeechRecognition();
        } else if (this.engineMode === 'in-browser' && window.location.protocol !== 'file:') {
            // Pre-warm the neural model in idle time so clicking the mic button is instantaneous
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => this.initTfjsSpeechEngine(true), { timeout: 3000 });
            } else {
                setTimeout(() => this.initTfjsSpeechEngine(true), 2000);
            }
        }
    }

    mountHUD() {
        if (document.getElementById('vui-root')) return;

        const isFirefoxEngine = this.engineMode === 'in-browser';
        const engineBadge = this.isGecko ? ' (Firefox)' : '';

        const destinationsHtml = `
            <div class="vui-category">
                <div class="vui-category-label">// Quick Destinations</div>
                <div class="vui-destinations-menu" id="vui-destinations-list">
                    <button class="vui-dest-item" data-cmd="zero" data-target="recent-commits-section">
                        <span><span class="vui-dest-num">// 00</span>Recent Activity</span>
                        <span class="vui-dest-voice-tag">"zero" / "commits"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="one" data-target="caster-voice-os">
                        <span><span class="vui-dest-num">// 01</span>Passion Project</span>
                        <span class="vui-dest-voice-tag">"personal project" / "one"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="two" data-target="solved-problems">
                        <span><span class="vui-dest-num">// 02</span>Solved Problems</span>
                        <span class="vui-dest-voice-tag">"two" / "problems"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="three" data-target="open-source">
                        <span><span class="vui-dest-num">// 03</span>Open Source</span>
                        <span class="vui-dest-voice-tag">"three" / "open source"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="four" data-target="tools">
                        <span><span class="vui-dest-num">// 04</span>Public Tools</span>
                        <span class="vui-dest-voice-tag">"four" / "tools"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="five" data-target="academic-projects">
                        <span><span class="vui-dest-num">// 05</span>School &amp; Engineering</span>
                        <span class="vui-dest-voice-tag">"five" / "school"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="back to top" data-target="top">
                        <span><span class="vui-dest-num">↑</span>Back to Top</span>
                        <span class="vui-dest-voice-tag">"back to top" / "go to top"</span>
                    </button>
                    <button class="vui-dest-item" data-cmd="timeline" data-target="timeline">
                        <span><span class="vui-dest-num">⏱</span>Evolution Timeline ↗</span>
                        <span class="vui-dest-voice-tag">"timeline"</span>
                    </button>
                </div>
            </div>
        `;

        const exhaustiveCheatsheetHtml = isFirefoxEngine ? `
            <div id="vui-exhaustive-commands" class="vui-exhaustive-view">
                <div class="vui-engine-note">
                    <strong>Firefox Neural Engine:</strong> Speak single keywords clearly into your microphone:
                </div>

                <div class="vui-category">
                    <div class="vui-category-label">// Keyword Commands</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="down"><span class="chip-quote">"</span>down<span class="chip-quote">"</span> ➔ Scroll Down</button>
                        <button class="vui-chip" data-cmd="up"><span class="chip-quote">"</span>up<span class="chip-quote">"</span> ➔ Scroll Up</button>
                        <button class="vui-chip" data-cmd="go"><span class="chip-quote">"</span>go<span class="chip-quote">"</span> ➔ Top</button>
                        <button class="vui-chip" data-cmd="stop"><span class="chip-quote">"</span>stop<span class="chip-quote">"</span> ➔ Stop</button>
                    </div>
                </div>
            </div>
        ` : `
            <div id="vui-exhaustive-commands" class="vui-exhaustive-view">
                <div class="vui-category">
                    <div class="vui-category-label">// Page Navigation &amp; Jumps</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="go to commits"><span class="chip-quote">"</span>Recent Activity<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="go to passion project"><span class="chip-quote">"</span>Personal Project<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="go to solved problems"><span class="chip-quote">"</span>Solved Problems<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="go to open source"><span class="chip-quote">"</span>Open Source<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="go to tools"><span class="chip-quote">"</span>Public Tools<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="go to school projects"><span class="chip-quote">"</span>School Projects<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="open timeline"><span class="chip-quote">"</span>Timeline<span class="chip-quote">"</span></button>
                    </div>
                </div>

                <div class="vui-category">
                    <div class="vui-category-label">// Scrolling &amp; Page Movement</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="scroll down"><span class="chip-quote">"</span>Scroll Down<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="scroll up"><span class="chip-quote">"</span>Scroll Up<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="next project"><span class="chip-quote">"</span>Next Project<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="previous project"><span class="chip-quote">"</span>Previous Project<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="back to top"><span class="chip-quote">"</span>Back to Top<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="bottom"><span class="chip-quote">"</span>Bottom<span class="chip-quote">"</span></button>
                    </div>
                </div>

                <div class="vui-category">
                    <div class="vui-category-label">// Keyboard Tab Navigation</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="tab"><span class="chip-quote">"</span>Tab<span class="chip-quote">"</span> / <span class="chip-quote">"</span>Tap<span class="chip-quote">"</span> ➔ Next Focus</button>
                        <button class="vui-chip" data-cmd="shift tab"><span class="chip-quote">"</span>Shift Tab<span class="chip-quote">"</span> / <span class="chip-quote">"</span>Shift Tap<span class="chip-quote">"</span> ➔ Prev Focus</button>
                    </div>
                </div>

                <div class="vui-category">
                    <div class="vui-category-label">// Visual Themes</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="dark mode"><span class="chip-quote">"</span>Dark Mode<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="light mode"><span class="chip-quote">"</span>Light Mode<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="high contrast"><span class="chip-quote">"</span>High Contrast<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="toggle theme"><span class="chip-quote">"</span>Toggle Theme<span class="chip-quote">"</span></button>
                    </div>
                </div>

                <div class="vui-category">
                    <div class="vui-category-label">// Voice &amp; Assistant Controls</div>
                    <div class="vui-chip-group">
                        <button class="vui-chip" data-cmd="stop listening"><span class="chip-quote">"</span>Stop Listening<span class="chip-quote">"</span></button>
                        <button class="vui-chip" data-cmd="close guide"><span class="chip-quote">"</span>Close Guide<span class="chip-quote">"</span></button>
                    </div>
                </div>
            </div>
        `;

        const drawerContent = `
            <div class="vui-drawer-header">
                <h3 class="vui-drawer-title">
                    <span aria-hidden="true">🎙️</span> Voice Navigator &amp; Guide ${engineBadge ? `<span class="vui-badge">${engineBadge.trim()}</span>` : ''}
                </h3>
                <button id="vui-drawer-close-btn" class="vui-drawer-close" aria-label="Close voice guide">✕</button>
            </div>

            ${destinationsHtml}

            <button id="vui-toggle-all-cmds-btn" class="vui-toggle-all-btn" aria-expanded="false">
                📋 Show All Voice Commands
            </button>

            ${exhaustiveCheatsheetHtml}
        `;

        const hudHtml = `
            <div id="vui-root" class="vui-container" aria-label="Voice Navigation Assistant">
                <!-- ARIA Live Region for Screen Readers -->
                <div id="vui-aria-live" class="sr-only" aria-live="polite"></div>

                <!-- Action Toast Notification -->
                <div id="vui-toast" class="vui-toast" role="status">
                    <span class="vui-toast-icon" aria-hidden="true">✓</span>
                    <span id="vui-toast-msg" class="vui-toast-text"></span>
                </div>

                <!-- Live Interim Transcript Bubble -->
                <div id="vui-transcript" class="vui-transcript-bubble" aria-hidden="true">
                    <span class="vui-transcript-tag">Heard:</span>
                    <span id="vui-interim-text" class="vui-interim-text">Listening...</span>
                </div>

                <!-- Interactive Guided Navigator Drawer -->
                <div id="vui-drawer" class="vui-drawer" role="dialog" aria-modal="false" aria-label="Voice Navigation Assistant">
                    ${drawerContent}
                </div>

                <!-- Floating HUD Pill -->
                <div id="vui-hud" class="vui-hud">
                    <button id="vui-mic-btn" class="vui-mic-btn" aria-label="Toggle Voice Navigation (Press V)" data-tooltip="Toggle Voice Navigation (Press V)" data-tooltip-pos="top">
                        <svg class="vui-mic-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                    </button>

                    <div class="vui-wave-bars" aria-hidden="true">
                        <span class="vui-bar"></span>
                        <span class="vui-bar"></span>
                        <span class="vui-bar"></span>
                        <span class="vui-bar"></span>
                    </div>

                    <div class="vui-label-group">
                        <span id="vui-status-title" class="vui-hud-title">Voice Nav${engineBadge} <span class="kbd">v</span></span>
                        <span id="vui-status-sub" class="vui-hud-subtitle">Click or press V</span>
                    </div>

                    <button id="vui-help-btn" class="vui-help-btn" aria-label="Show Voice Commands Guide">Guide</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', hudHtml);

        this.dom = {
            root: document.getElementById('vui-root'),
            hud: document.getElementById('vui-hud'),
            micBtn: document.getElementById('vui-mic-btn'),
            statusTitle: document.getElementById('vui-status-title'),
            statusSub: document.getElementById('vui-status-sub'),
            helpBtn: document.getElementById('vui-help-btn'),
            drawer: document.getElementById('vui-drawer'),
            drawerCloseBtn: document.getElementById('vui-drawer-close-btn'),
            toggleAllCmdsBtn: document.getElementById('vui-toggle-all-cmds-btn'),
            exhaustiveCommands: document.getElementById('vui-exhaustive-commands'),
            destItems: document.querySelectorAll('.vui-dest-item'),
            transcript: document.getElementById('vui-transcript'),
            interimText: document.getElementById('vui-interim-text'),
            toast: document.getElementById('vui-toast'),
            toastMsg: document.getElementById('vui-toast-msg'),
            ariaLive: document.getElementById('vui-aria-live'),
            waveBars: document.querySelectorAll('#vui-hud .vui-bar')
        };
    }

    setupEventListeners() {
        if (!this.dom) return;

        this.dom.micBtn.addEventListener('click', () => this.toggleListening());
        this.dom.helpBtn.addEventListener('click', () => this.toggleDrawer());
        this.dom.drawerCloseBtn.addEventListener('click', () => this.closeDrawer());

        if (this.dom.toggleAllCmdsBtn) {
            this.dom.toggleAllCmdsBtn.addEventListener('click', () => this.toggleAllCommands());
        }

        // Keyboard navigation custom event sync ('v' key)
        window.addEventListener('togglevoicenav', () => this.toggleListening());

        // Close drawer on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.dom.drawer.classList.contains('open')) {
                this.closeDrawer();
            }
        });

        // Clickable command chips and destination buttons
        this.dom.drawer.addEventListener('click', (e) => {
            const chip = e.target.closest('.vui-chip');
            if (chip) {
                const cmd = chip.getAttribute('data-cmd');
                if (cmd) {
                    this.executeCommand(cmd);
                }
                return;
            }

            const destBtn = e.target.closest('.vui-dest-item');
            if (destBtn) {
                const cmd = destBtn.getAttribute('data-cmd');
                if (cmd) {
                    this.executeCommand(cmd);
                }
            }
        });
    }

    setupScrollSpy() {
        const sections = [
            { id: 'recent-commits-section', el: document.getElementById('recent-commits-section') },
            { id: 'caster-voice-os', el: document.getElementById('caster-voice-os') },
            { id: 'solved-problems', el: document.getElementById('solved-problems') },
            { id: 'open-source', el: document.getElementById('open-source') },
            { id: 'tools', el: document.getElementById('tools') },
            { id: 'academic-projects', el: document.getElementById('academic-projects') }
        ];

        window.addEventListener('scroll', () => {
            let current = '';
            for (const sec of sections) {
                if (sec.el) {
                    const rect = sec.el.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 100) {
                        current = sec.id;
                        break;
                    }
                }
            }
            if (current && current !== this.currentActiveSection) {
                this.currentActiveSection = current;
                this.highlightActiveDestination(current);
            }
        }, { passive: true });
    }

    highlightActiveDestination(sectionId) {
        if (!this.dom || !this.dom.destItems) return;
        this.dom.destItems.forEach(item => {
            if (item.getAttribute('data-target') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    dismissTour() {
        if (!this.dom || !this.dom.tourCard) return;
        this.tourDismissed = true;
        this.dom.tourCard.style.display = 'none';
        this.showToast('Tutorial closed. Click "Show All Voice Commands" for full cheatsheet.');
        this.playChime(false);
    }

    openTour() {
        if (!this.dom || !this.dom.tourCard) return;
        this.tourDismissed = false;
        this.dom.tourCard.style.display = 'block';
        this.tourStep = 1;
        this.advanceTour(1);
        this.showToast('Interactive tutorial started.');
        this.playChime(true);
    }

    toggleAllCommands(forceState = null) {
        if (!this.dom || !this.dom.exhaustiveCommands || !this.dom.toggleAllCmdsBtn) return;
        const isOpen = this.dom.exhaustiveCommands.classList.contains('open');
        const shouldOpen = forceState !== null ? forceState : !isOpen;

        if (shouldOpen) {
            this.dom.exhaustiveCommands.classList.add('open');
            this.dom.toggleAllCmdsBtn.innerHTML = '🔼 Simplified View';
            this.dom.toggleAllCmdsBtn.setAttribute('aria-expanded', 'true');
            this.showToast('Showing all voice commands');
        } else {
            this.dom.exhaustiveCommands.classList.remove('open');
            this.dom.toggleAllCmdsBtn.innerHTML = '📋 Show All Voice Commands';
            this.dom.toggleAllCmdsBtn.setAttribute('aria-expanded', 'false');
            this.showToast('Showing simplified view');
        }
        this.playChime(true);
    }

    handleTabNavigation(reverse = false) {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const allElements = Array.from(document.querySelectorAll(selector));
        const focusable = allElements.filter(el => {
            const isVisible = el.offsetParent !== null || el.getClientRects().length > 0;
            return isVisible && !el.closest('#vui-root');
        });

        if (!focusable.length) return;

        let currentIndex = focusable.indexOf(document.activeElement);

        // If activeElement is not in focusable (e.g. user jumped to a section or clicked non-interactive area):
        if (currentIndex === -1) {
            // 1. If we have a tracked last target section/element, find the first focusable inside or following it
            if (this.lastTargetElement && document.contains(this.lastTargetElement)) {
                const inner = focusable.filter(el => this.lastTargetElement.contains(el));
                if (inner.length > 0) {
                    currentIndex = reverse ? focusable.indexOf(inner[inner.length - 1]) + 1 : focusable.indexOf(inner[0]) - 1;
                } else {
                    const afterIdx = focusable.findIndex(el => (this.lastTargetElement.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
                    if (afterIdx !== -1) {
                        currentIndex = reverse ? afterIdx : afterIdx - 1;
                    }
                }
            }

            // 2. If still not resolved, check viewport position
            if (currentIndex === -1) {
                const inViewIdx = focusable.findIndex(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.top >= 40 && rect.bottom <= window.innerHeight + 100;
                });
                if (inViewIdx !== -1) {
                    currentIndex = reverse ? inViewIdx : inViewIdx - 1;
                } else {
                    currentIndex = reverse ? 0 : focusable.length - 1;
                }
            }
        }

        let nextIndex;
        if (reverse) {
            nextIndex = (currentIndex - 1 + focusable.length) % focusable.length;
        } else {
            nextIndex = (currentIndex + 1) % focusable.length;
        }

        const targetEl = focusable[nextIndex];
        if (targetEl) {
            targetEl.focus();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            this.lastTargetElement = targetEl.closest('.navigable-item, section, header, nav') || targetEl;

            const rawLabel = (targetEl.innerText || targetEl.getAttribute('aria-label') || targetEl.title || 'Element').trim().replace(/\s+/g, ' ');
            const label = rawLabel.length > 25 ? rawLabel.slice(0, 25) + '...' : rawLabel;
            const actionName = reverse ? 'Shift-Tab' : 'Tab';
            this.showToast(`${actionName} ➔ ${label}`);
            this.playChime(true);
        }
    }

    /* ========================================================================
     * Mode 1: Native Web Speech Recognition Pipeline (Chromium, Safari, Edge)
     * ======================================================================== */
    setupNativeSpeechRecognition() {
        try {
            this.recognition = new this.SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUIState(true);
                this.playChime(true);
                if (this.dom && this.dom.drawer && !this.dom.drawer.classList.contains('open')) {
                    this.dom.drawer.classList.add('open');
                }
                this.showToast('Voice active! Say "Personal Project", "Solved Problems", or "Help"');
                this.announceSR('Voice navigation active. Listening for commands.');
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (interimTranscript) {
                    this.showInterimTranscript(interimTranscript);
                }

                if (finalTranscript) {
                    this.showInterimTranscript(finalTranscript);
                    this.executeCommand(finalTranscript);
                }
            };

            this.recognition.onerror = (event) => {
                if (event.error === 'no-speech') return;
                console.warn('Speech recognition error:', event.error);
                this.shouldBeListening = false;
                this.isListening = false;
                this.updateUIState(false);

                if (event.error === 'not-allowed') {
                    this.showToast('Microphone access blocked. Grant mic permissions in browser.');
                } else if (event.error === 'network') {
                    this.showToast('Network error. Speech recognition requires an active connection.');
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                if (this.shouldBeListening) {
                    try {
                        this.recognition.start();
                    } catch (e) {
                        this.updateUIState(false);
                    }
                } else {
                    this.updateUIState(false);
                }
            };
        } catch (err) {
            console.warn('Failed to initialize native speech recognition, switching to in-browser engine:', err);
            this.engineMode = this.hasMediaDevices ? 'in-browser' : 'none';
        }
    }

    /* ========================================================================
     * Mode 2: In-Browser Neural Speech Commands Engine (Firefox, Waterfox & Fallback)
     * ======================================================================== */
    loadScript(src) {
        if (document.querySelector(`script[src="${src}"]`)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = (err) => reject(err);
            document.head.appendChild(s);
        });
    }

    async initTfjsSpeechEngine(silent = false) {
        if (this.tfRecognizer) return this.tfRecognizer;
        if (this.isLoadingModel) return null;

        if (window.location.protocol === 'file:') {
            if (!silent) {
                this.showToast('Microphone requires HTTP/HTTPS. Please serve via localhost or GitHub Pages.');
            }
            throw new Error('getUserMedia not permitted on file:/// protocol in Firefox/Waterfox');
        }

        this.isLoadingModel = true;
        if (!silent) {
            this.showToast('Preparing speech engine (~1.5 MB)...');
            this.showInterimTranscript('Loading neural model...');
        }

        try {
            // Lazy load TensorFlow.js and the pre-trained Speech Commands model
            await this.loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
            await this.loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands');

            const sc = window.speechCommands || (window.tf && window.tf.speechCommands);
            if (!sc) {
                throw new Error('speechCommands library not available');
            }

            const recognizer = sc.create('BROWSER_FFT');
            await recognizer.ensureModelLoaded();

            this.tfRecognizer = recognizer;
            this.isLoadingModel = false;
            return recognizer;
        } catch (err) {
            this.isLoadingModel = false;
            if (!silent) {
                console.warn('Failed to load TFJS speech commands engine:', err);
            }
            throw err;
        }
    }

    async startInBrowserEngine() {
        let tempStream = null;
        try {
            // 1. Immediately request microphone access while the user gesture is active!
            if (!this.micPermissionGranted) {
                try {
                    tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    this.micPermissionGranted = true;
                } catch (permErr) {
                    console.warn('Microphone permission error:', permErr);
                    if (window.location.protocol === 'file:') {
                        this.showToast('Microphone blocked on local file://. Run on GitHub Pages or local server.');
                    } else {
                        this.showToast('Microphone access blocked. Click mic and allow permissions in browser.');
                    }
                    this.updateUIState(false);
                    return;
                }
            }

            const recognizer = await this.initTfjsSpeechEngine();
            if (!recognizer) {
                if (tempStream) tempStream.getTracks().forEach(t => t.stop());
                return;
            }

            // Stop temporary stream before recognizer attaches its own Web Audio graph
            if (tempStream) {
                tempStream.getTracks().forEach(t => t.stop());
            }

            if (recognizer.isListening()) {
                await recognizer.stopListening();
            }

            this.isListening = true;
            this.shouldBeListening = true;
            this.updateUIState(true);
            this.playChime(true);
            if (this.dom && this.dom.drawer && !this.dom.drawer.classList.contains('open')) {
                this.dom.drawer.classList.add('open');
            }
            this.showToast('Voice active! Say "one", "two", "up", "down", "stop"');
            this.announceSR('Voice navigation active. Listening for commands.');
            this.showInterimTranscript('Listening (Firefox)...');

            await recognizer.listen(result => {
                const labels = recognizer.wordLabels();
                const maxScore = Math.max(...result.scores);
                const index = result.scores.indexOf(maxScore);
                const word = labels[index];

                // Confidence threshold to eliminate false positives and background noise
                if (maxScore >= 0.70 && word && word !== '_background_noise_' && word !== '_unknown_') {
                    this.showInterimTranscript(`Heard: "${word}"`);
                    this.executeCommand(word);
                }
            }, {
                includeSpectrogram: false,
                probabilityThreshold: 0.70,
                invokeCallbackOnNoiseAndUnknown: false
            });
        } catch (err) {
            console.warn('In-browser speech recognition error:', err);
            if (tempStream) {
                tempStream.getTracks().forEach(t => t.stop());
            }
            this.shouldBeListening = false;
            this.isListening = false;
            this.updateUIState(false);

            if (window.location.protocol === 'file:') {
                this.showToast('Microphone blocked on local file://. Run with local server or GitHub Pages.');
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                this.showToast('Microphone access blocked. Click mic and allow permissions in browser.');
            } else {
                this.showToast(`Voice error: ${err.message || 'Microphone unavailable'}`);
            }
        }
    }

    async stopInBrowserEngine() {
        if (this.tfRecognizer && this.tfRecognizer.isListening()) {
            try {
                await this.tfRecognizer.stopListening();
            } catch (e) {}
        }
    }

    /* ========================================================================
     * Unified Lifecycle & State Control
     * ======================================================================== */
    toggleListening() {
        if (!this.isSupported) {
            this.showToast('Microphone access is not supported in this browser.');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    async startListening() {
        this.shouldBeListening = true;

        if (this.engineMode === 'native' && this.recognition) {
            try {
                this.recognition.start();
            } catch (e) {
                // Already running
            }
        } else if (this.engineMode === 'in-browser') {
            await this.startInBrowserEngine();
        }
    }

    async stopListening() {
        this.shouldBeListening = false;

        if (this.engineMode === 'native' && this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {}
        } else if (this.engineMode === 'in-browser') {
            await this.stopInBrowserEngine();
        }

        this.isListening = false;
        this.updateUIState(false);
        this.playChime(false);
        this.announceSR('Voice navigation paused.');
    }

    updateUIState(listening) {
        if (!this.dom) return;

        const engineBadge = this.isGecko ? ' (Firefox)' : '';

        if (listening) {
            this.dom.hud.classList.add('is-listening');
            this.dom.statusTitle.innerHTML = `Listening... <span class="kbd">v</span>`;
            if (this.engineMode === 'in-browser') {
                this.dom.statusSub.textContent = `Say "one", "two", "up", "down"...`;
            } else {
                this.dom.statusSub.textContent = `Say "Personal Project", "Light Mode"...`;
            }
            this.dom.micBtn.setAttribute('aria-label', 'Stop Voice Navigation (Press V)');
        } else {
            this.dom.hud.classList.remove('is-listening');
            this.dom.statusTitle.innerHTML = `Voice Nav${engineBadge} <span class="kbd">v</span>`;
            this.dom.statusSub.textContent = `Click or press V`;
            this.dom.micBtn.setAttribute('aria-label', 'Start Voice Navigation (Press V)');
            this.hideTranscript();
        }
    }

    setUnsupportedState() {
        if (!this.dom) return;
        this.dom.statusTitle.textContent = 'Voice Unavailable';
        this.dom.statusSub.textContent = 'Microphone required';
        this.dom.micBtn.style.opacity = '0.5';
    }

    showInterimTranscript(text) {
        if (!this.dom || !this.dom.transcript) return;
        this.dom.interimText.textContent = text;
        this.dom.transcript.classList.add('visible');
    }

    hideTranscript() {
        if (!this.dom || !this.dom.transcript) return;
        this.dom.transcript.classList.remove('visible');
    }

    showToast(message) {
        if (!this.dom || !this.dom.toast) return;
        this.dom.toastMsg.textContent = message;
        this.dom.toast.classList.add('visible');
        this.announceSR(message);

        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.dom.toast.classList.remove('visible');
        }, 3200);
    }

    toggleDrawer() {
        if (!this.dom || !this.dom.drawer) return;
        this.dom.drawer.classList.toggle('open');
    }

    closeDrawer() {
        if (!this.dom || !this.dom.drawer) return;
        this.dom.drawer.classList.remove('open');
    }

    announceSR(text) {
        if (!this.dom || !this.dom.ariaLive) return;
        this.dom.ariaLive.textContent = text;
    }

    playChime(success = true) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            if (!this.audioCtx) {
                this.audioCtx = new AudioContext();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            gain.connect(this.audioCtx.destination);
            osc.connect(gain);

            if (success) {
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.start(now);
                osc.stop(now + 0.15);
            } else {
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            // AudioContext suspended before user gesture
        }
    }

    /* ========================================================================
     * Natural Voice & Spoken Keyword Command Processing Matrix
     * ======================================================================== */
    executeCommand(rawText) {
        const text = rawText.toLowerCase().replace(/[.,!?;:]/g, '').trim();

        // 1. Navigation Commands (Forgiving matchers supporting synonyms, singular/plural, few syllables, numbers)
        // Section 1: Passion Project
        if (/^(1|one|first)$/i.test(text) || /(personal\s*projects?|passion\s*projects?|passion|caster(\s*os|\s*voice)?|voice\s*os|flagship|section\s*(1|one))/i.test(text)) {
            this.jumpTo('caster-voice-os', 'Jumped to Caster Voice OS (Section 1)');
            return;
        }

        // Section 2: Solved Problems
        if (/^(2|two|second)$/i.test(text) || /(solved\s*problems?|problems?|tactical\s*tracker|activity\s*tracker|tracker|app\s*switcher|switcher|section\s*(2|two))/i.test(text)) {
            this.jumpTo('solved-problems', 'Jumped to Solved Problems (Section 2)');
            return;
        }

        // Section 3: Open Source
        if (/^(3|three|third)$/i.test(text) || /(open\s*source|contributions?|pull\s*requests?|merged\s*prs?|prs?|pr\s*#?\d+|dragonfly|pyvda|section\s*(3|three))/i.test(text)) {
            this.jumpTo('open-source', 'Jumped to Open Source Contributions (Section 3)');
            return;
        }

        // Section 4: Public Tools
        if (/^(4|four|fourth)$/i.test(text) || /(public\s*tools?|tools?|tool|winstasis|vdtree|virtual\s*desktop|section\s*(4|four))/i.test(text)) {
            this.jumpTo('tools', 'Jumped to Public Tools (Section 4)');
            return;
        }

        // Section 5: School & Applied Engineering
        if (/^(5|five|fifth)$/i.test(text) || /(school\s*projects?|school|applied\s*engineering|engineering|academic|capstone|bms|battery|mail|mail\s*detector|lidar|5g|sensor|section\s*(5|five))/i.test(text)) {
            this.jumpTo('academic-projects', 'Jumped to School & Applied Engineering (Section 5)');
            return;
        }

        // Section 0: Recent Activity
        if (/^(0|zero)$/i.test(text) || /(recent\s*activity|activity|live\s*commits|commits?|github\s*feed|recent|section\s*(0|zero))/i.test(text)) {
            this.jumpTo('recent-commits-section', 'Jumped to Recent Activity (Section 0)');
            return;
        }

        // Timeline
        if (/(open|show|go to)?.*(timeline|evolution\s*timeline|git\s*history|git\s*timeline)/i.test(text)) {
            this.showToast('Opening Evolution Timeline...');
            this.playChime(true);
            setTimeout(() => {
                window.location.href = './timeline.html';
            }, 500);
            return;
        }

        if (/(back to portfolio|home|main page|portfolio home)/i.test(text)) {
            this.showToast('Returning to Portfolio Home...');
            this.playChime(true);
            setTimeout(() => {
                window.location.href = './index.html';
            }, 500);
            return;
        }

        // 2. Tab Keyboard Emulation Commands (Forward & Backward)
        // Robust against phonetic collisions with 'tap', 'tabbing', etc.
        if (/(^(tab|tap|tabbing|tapping)$|(tab|tap)\s*forward|next\s*focus|(tab|tap)\s*next)/i.test(text)) {
            this.handleTabNavigation(false);
            return;
        }

        if (/(shift\s*(tab|tap)|(tab|tap)\s*back|(tab|tap)\s*backward|prev\s*focus|previous\s*focus)/i.test(text)) {
            this.handleTabNavigation(true);
            return;
        }

        // 3. Stepping & Scrolling Commands
        if (/^(next|next\s*project|next\s*item|next\s*entry)$/i.test(text) || /next (project|item|entry)?/i.test(text)) {
            this.stepProject('next');
            this.showToast('Navigated to next project');
            this.playChime(true);
            return;
        }

        if (/^(prev|previous|prev\s*project|previous\s*project)$/i.test(text) || /(previous|prev) (project|item|entry)?/i.test(text)) {
            this.stepProject('prev');
            this.showToast('Navigated to previous project');
            this.playChime(true);
            return;
        }

        if (/(scroll\s*down|page\s*down|^down$|go\s*down|move\s*down)/i.test(text)) {
            const scrollAmount = Math.max(window.innerHeight * 0.7, 350);
            window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            this.showToast('Scrolled down');
            this.playChime(true);
            return;
        }

        if (/(scroll\s*up|page\s*up|^up$|go\s*up|move\s*up)/i.test(text)) {
            const scrollAmount = Math.max(window.innerHeight * 0.7, 350);
            window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            this.showToast('Scrolled up');
            this.playChime(true);
            return;
        }

        // Top of Page (requires explicit phrase so 'tab' / 'tap' never collides with 'top')
        if (/(back\s*to\s*top|go\s*to\s*(the\s*)?top|scroll\s*to\s*(the\s*)?top|top\s*of\s*(the\s*)?page|^home$)/i.test(text)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const topNav = document.getElementById('top');
            if (topNav) topNav.focus();
            this.showToast('Jumped to top of page');
            this.playChime(true);
            return;
        }

        // Bottom of Page (requires explicit phrase)
        if (/(scroll\s*to\s*(the\s*)?bottom|go\s*to\s*(the\s*)?bottom|bottom\s*of\s*(the\s*)?page)/i.test(text)) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            this.showToast('Jumped to bottom of page');
            this.playChime(true);
            return;
        }

        // 4. Visual Themes
        if (/(dark\s*mode|dark\s*theme|^dark$)/i.test(text)) {
            this.setThemeDirect('dark', 'Switched to Dark Theme');
            return;
        }

        if (/(light\s*mode|light\s*theme|^light$)/i.test(text)) {
            this.setThemeDirect('light', 'Switched to Light Theme');
            return;
        }

        if (/(high\s*contrast|contrast\s*mode|^contrast$)/i.test(text)) {
            this.setThemeDirect('high-contrast', 'Switched to High Contrast Mode');
            return;
        }

        if (/(toggle\s*theme|switch\s*theme|cycle\s*theme|^theme$)/i.test(text)) {
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) toggleBtn.click();
            this.showToast('Toggled visual theme');
            this.playChime(true);
            return;
        }

        // 5. Cheatsheet & View Controls
        if (/(show\s*all\s*commands|all\s*commands|full\s*commands|show\s*cheatsheet|^cheatsheet$|exhaustive)/i.test(text)) {
            this.toggleAllCommands(true);
            return;
        }

        if (/(simplified\s*view|simple\s*view|hide\s*all\s*commands)/i.test(text)) {
            this.toggleAllCommands(false);
            return;
        }

        if (/(help|commands|what\s*can\s*i\s*say|show\s*help|show\s*guide|^guide$)/i.test(text)) {
            if (this.dom && this.dom.drawer && !this.dom.drawer.classList.contains('open')) {
                this.toggleDrawer();
            }
            this.showToast('Opened Voice Navigation Guide');
            this.playChime(true);
            return;
        }

        if (/(close\s*help|close\s*guide|close\s*commands|close\s*drawer|dismiss|minimize)/i.test(text)) {
            this.closeDrawer();
            this.showToast('Closed Voice Commands Guide');
            this.playChime(true);
            return;
        }

        // 6. Voice & Mic Controls
        if (/^(stop|stop\s*listening|stop\s*voice|stop\s*mic|turn\s*off\s*voice|turn\s*off\s*listening|turn\s*off\s*mic|turn\s*off\s*microphone|turn\s*off|turn\s*voice\s*off|turn\s*mic\s*off|shut\s*off|shut\s*down|disable\s*voice|disable\s*mic|mute\s*mic|mute\s*voice|mute|sleep|pause\s*voice|pause\s*listening|pause\s*mic|pause|quit\s*voice|exit\s*voice|deactivate)$/i.test(text) || /(stop listening|turn off (the )?(mic|microphone|voice)|turn (the )?(mic|microphone|voice) off|disable (the )?(mic|voice)|stop recognition)/i.test(text)) {
            this.stopListening();
            this.closeDrawer();
            this.showToast('Voice navigation turned off. Click mic or press V to restart.');
            return;
        }
    }

    jumpTo(elementId, toastMessage) {
        const target = document.getElementById(elementId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.focus({ preventScroll: true });
            this.lastTargetElement = target;
            this.showToast(toastMessage);
            this.playChime(true);
            this.highlightActiveDestination(elementId);
        }
    }

    stepProject(direction) {
        const projects = Array.from(document.querySelectorAll('.navigable-item'));
        if (!projects.length) return;

        const activeProject = document.activeElement ? document.activeElement.closest('.navigable-item') : null;
        let target = null;
        const activeIdx = projects.indexOf(activeProject);

        if (direction === 'next') {
            if (activeIdx !== -1 && activeIdx < projects.length - 1) {
                target = projects[activeIdx + 1];
            } else {
                for (const project of projects) {
                    if (project.getBoundingClientRect().top > 60) {
                        target = project;
                        break;
                    }
                }
            }
        } else {
            if (activeIdx !== -1 && activeIdx > 0) {
                target = projects[activeIdx - 1];
            } else {
                for (let i = projects.length - 1; i >= 0; i--) {
                    const project = projects[i];
                    if (project.getBoundingClientRect().top < -60) {
                        target = project;
                        break;
                    }
                }
            }
        }

        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.focus({ preventScroll: true });
            this.lastTargetElement = target;
            this.highlightActiveDestination(target.id);
        }
    }

    setThemeDirect(themeName, toastMsg) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);

        const themeLabel = document.getElementById('theme-label');
        if (themeLabel) {
            themeLabel.textContent = themeName === 'high-contrast' ? 'Contrast' : (themeName === 'light' ? 'Light' : 'Dark');
        }

        this.showToast(toastMsg);
        this.playChime(true);
    }
}

window.VoiceNav = VoiceNav;
