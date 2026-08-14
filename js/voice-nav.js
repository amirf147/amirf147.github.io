/**
 * ============================================================================
 * Voice Navigation & HUD Overlay Module
 * Native Web Speech Recognition Engine with Senior Voice UX (VUI) feedback.
 * Demonstrates Caster Voice OS hands-free navigation directly in the browser.
 * Compatible with local file:// protocol and https:// GitHub Pages.
 * ============================================================================
 */

class VoiceNav {
    constructor() {
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.isSupported = !window.location.protocol.startsWith('http') && !this.SpeechRecognition ? false : !!this.SpeechRecognition;

        this.recognition = null;
        this.isListening = false;
        this.shouldBeListening = localStorage.getItem('voice_nav_active') === 'true';
        this.audioCtx = null;
        this.toastTimeout = null;

        this.init();
    }

    init() {
        this.mountHUD();
        this.setupEventListeners();

        if (!this.isSupported) {
            this.setUnsupportedState();
            return;
        }

        this.setupSpeechRecognition();

        // Restore active state if user previously had it enabled
        if (this.shouldBeListening) {
            this.startListening();
        }
    }

    mountHUD() {
        if (document.getElementById('vui-root')) return;

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

                <!-- Interactive Cheatsheet Drawer -->
                <div id="vui-drawer" class="vui-drawer" role="dialog" aria-modal="false" aria-label="Voice Commands Cheatsheet">
                    <div class="vui-drawer-header">
                        <h3 class="vui-drawer-title">
                            <span aria-hidden="true">🎙️</span> Voice Commands Guide
                        </h3>
                        <button id="vui-drawer-close-btn" class="vui-drawer-close" aria-label="Close voice commands guide">✕</button>
                    </div>

                    <div class="vui-category">
                        <div class="vui-category-label">// Navigation</div>
                        <div class="vui-chip-group">
                            <button class="vui-chip" data-cmd="go to caster"><span class="chip-quote">"</span>Go to Caster<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="go to solved problems"><span class="chip-quote">"</span>Solved Problems<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="go to open source"><span class="chip-quote">"</span>Open Source<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="go to tools"><span class="chip-quote">"</span>Public Tools<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="go to commits"><span class="chip-quote">"</span>Recent Commits<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="open timeline"><span class="chip-quote">"</span>Open Timeline<span class="chip-quote">"</span></button>
                        </div>
                    </div>

                    <div class="vui-category">
                        <div class="vui-category-label">// Stepping & Scrolling</div>
                        <div class="vui-chip-group">
                            <button class="vui-chip" data-cmd="next project"><span class="chip-quote">"</span>Next Project<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="previous project"><span class="chip-quote">"</span>Previous Project<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="scroll down"><span class="chip-quote">"</span>Scroll Down<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="scroll up"><span class="chip-quote">"</span>Scroll Up<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="back to top"><span class="chip-quote">"</span>Back to Top<span class="chip-quote">"</span></button>
                        </div>
                    </div>

                    <div class="vui-category">
                        <div class="vui-category-label">// Theme & Accessibility</div>
                        <div class="vui-chip-group">
                            <button class="vui-chip" data-cmd="dark mode"><span class="chip-quote">"</span>Dark Mode<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="light mode"><span class="chip-quote">"</span>Light Mode<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="high contrast"><span class="chip-quote">"</span>High Contrast<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="toggle theme"><span class="chip-quote">"</span>Toggle Theme<span class="chip-quote">"</span></button>
                        </div>
                    </div>

                    <div class="vui-category">
                        <div class="vui-category-label">// Voice & Mic Controls</div>
                        <div class="vui-chip-group">
                            <button class="vui-chip" data-cmd="stop listening"><span class="chip-quote">"</span>Stop Listening<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="turn off mic"><span class="chip-quote">"</span>Turn Off Mic<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="close guide"><span class="chip-quote">"</span>Close Guide<span class="chip-quote">"</span></button>
                            <button class="vui-chip" data-cmd="help"><span class="chip-quote">"</span>Help / Commands<span class="chip-quote">"</span></button>
                        </div>
                    </div>
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
                        <span id="vui-status-title" class="vui-hud-title">Voice Nav <span class="kbd">v</span></span>
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
            transcript: document.getElementById('vui-transcript'),
            interimText: document.getElementById('vui-interim-text'),
            toast: document.getElementById('vui-toast'),
            toastMsg: document.getElementById('vui-toast-msg'),
            ariaLive: document.getElementById('vui-aria-live')
        };
    }

    setupEventListeners() {
        if (!this.dom) return;

        this.dom.micBtn.addEventListener('click', () => this.toggleListening());
        this.dom.helpBtn.addEventListener('click', () => this.toggleDrawer());
        this.dom.drawerCloseBtn.addEventListener('click', () => this.closeDrawer());

        // Keyboard navigation custom event sync ('v' key)
        window.addEventListener('togglevoicenav', () => this.toggleListening());

        // Close drawer on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.dom.drawer.classList.contains('open')) {
                this.closeDrawer();
            }
        });

        // Clickable command chips
        const chips = this.dom.drawer.querySelectorAll('.vui-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const cmd = chip.getAttribute('data-cmd');
                if (cmd) {
                    this.executeCommand(cmd);
                    this.closeDrawer();
                }
            });
        });
    }

    setupSpeechRecognition() {
        try {
            this.recognition = new this.SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUIState(true);
                this.playChime(true);
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
                if (event.error === 'not-allowed') {
                    this.shouldBeListening = false;
                    localStorage.setItem('voice_nav_active', 'false');
                    this.updateUIState(false);
                    this.showToast('Microphone access blocked. Click mic to retry.');
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
            console.error('Failed to initialize speech recognition:', err);
            this.setUnsupportedState();
        }
    }

    toggleListening() {
        if (!this.isSupported) {
            this.showToast('Voice recognition active on Chrome, Edge, and Safari.');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition) return;
        this.shouldBeListening = true;
        localStorage.setItem('voice_nav_active', 'true');
        try {
            this.recognition.start();
        } catch (e) {
            // Already started or restarting
        }
    }

    stopListening() {
        this.shouldBeListening = false;
        localStorage.setItem('voice_nav_active', 'false');
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {}
        }
        this.updateUIState(false);
        this.playChime(false);
        this.announceSR('Voice navigation paused.');
    }

    updateUIState(listening) {
        if (!this.dom) return;

        if (listening) {
            this.dom.hud.classList.add('is-listening');
            this.dom.statusTitle.innerHTML = `Listening... <span class="kbd">v</span>`;
            this.dom.statusSub.textContent = `Say "Help" or "Go to..."`;
            this.dom.micBtn.setAttribute('aria-label', 'Stop Voice Navigation (Press V)');
        } else {
            this.dom.hud.classList.remove('is-listening');
            this.dom.statusTitle.innerHTML = `Voice Nav <span class="kbd">v</span>`;
            this.dom.statusSub.textContent = `Click or press V`;
            this.dom.micBtn.setAttribute('aria-label', 'Start Voice Navigation (Press V)');
            this.hideTranscript();
        }
    }

    setUnsupportedState() {
        if (!this.dom) return;
        this.dom.statusTitle.textContent = 'Voice (Chrome/Edge)';
        this.dom.statusSub.textContent = 'Speech API ready';
        this.dom.micBtn.style.opacity = '0.7';
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
            // AudioContext not permitted before user interaction
        }
    }

    executeCommand(rawText) {
        const text = rawText.toLowerCase().trim();

        // 1. Navigation Commands
        if (/(go to|jump to|open|show)?.*(caster|passion project|voice os|flagship)/i.test(text)) {
            this.jumpTo('caster-voice-os', 'Jumped to Caster Voice OS');
            return;
        }

        if (/(go to|jump to|open|show)?.*(solved problems|problem|tracker|app switcher)/i.test(text)) {
            this.jumpTo('solved-problems', 'Jumped to Solved Problems');
            return;
        }

        if (/(go to|jump to|open|show)?.*(open source|contributions|merged prs|pull requests|dragonfly|pyvda)/i.test(text)) {
            this.jumpTo('open-source', 'Jumped to Open Source Contributions');
            return;
        }

        if (/(go to|jump to|open|show)?.*(tools|public tools|winstasis|vdtree|virtual desktop)/i.test(text)) {
            this.jumpTo('tools', 'Jumped to Public Tools');
            return;
        }

        if (/(go to|jump to|open|show)?.*(commits|recent activity|activity feed|github feed)/i.test(text)) {
            this.jumpTo('recent-commits-section', 'Jumped to Recent Activity');
            return;
        }

        if (/(open|show|go to)?.*(timeline|evolution timeline|git history)/i.test(text)) {
            this.showToast('Opening Evolution Timeline...');
            this.playChime(true);
            setTimeout(() => {
                window.location.href = './timeline.html';
            }, 500);
            return;
        }

        if (/(back to portfolio|home|main page)/i.test(text)) {
            this.showToast('Returning to Portfolio Home...');
            this.playChime(true);
            setTimeout(() => {
                window.location.href = './index.html';
            }, 500);
            return;
        }

        // 2. Stepping & Scrolling Commands
        if (/next (project|item|entry)?/i.test(text)) {
            this.stepProject('next');
            this.showToast('Navigated to next project');
            this.playChime(true);
            return;
        }

        if (/(previous|prev) (project|item|entry)?/i.test(text)) {
            this.stepProject('prev');
            this.showToast('Navigated to previous project');
            this.playChime(true);
            return;
        }

        if (/(scroll down|page down|down)/i.test(text)) {
            window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
            this.showToast('Scrolled down');
            this.playChime(true);
            return;
        }

        if (/(scroll up|page up|up)/i.test(text)) {
            window.scrollBy({ top: -window.innerHeight * 0.75, behavior: 'smooth' });
            this.showToast('Scrolled up');
            this.playChime(true);
            return;
        }

        if (/(back to top|go to top|top)/i.test(text)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const topNav = document.getElementById('top');
            if (topNav) topNav.focus();
            this.showToast('Jumped to top');
            this.playChime(true);
            return;
        }

        if (/(go to bottom|scroll to bottom|bottom)/i.test(text)) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            this.showToast('Jumped to bottom');
            this.playChime(true);
            return;
        }

        // 3. Theme Controls
        if (/(dark mode|dark theme|switch to dark)/i.test(text)) {
            this.setThemeDirect('dark', 'Switched to Dark Theme');
            return;
        }

        if (/(light mode|light theme|switch to light)/i.test(text)) {
            this.setThemeDirect('light', 'Switched to Light Theme');
            return;
        }

        if (/(high contrast|contrast mode|switch to contrast)/i.test(text)) {
            this.setThemeDirect('high-contrast', 'Switched to High Contrast Mode');
            return;
        }

        if (/(toggle theme|switch theme|cycle theme)/i.test(text)) {
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) toggleBtn.click();
            this.showToast('Toggled visual theme');
            this.playChime(true);
            return;
        }

        // 4. Help & Cheatsheet
        if (/(help|what can i say|commands|show commands|show help|guide|cheatsheet)/i.test(text)) {
            this.toggleDrawer();
            this.showToast('Opened Voice Commands Guide');
            this.playChime(true);
            return;
        }

        if (/(close help|close guide|close commands|close drawer|close cheatsheet|hide guide|hide help|hide commands|dismiss)/i.test(text)) {
            this.closeDrawer();
            this.showToast('Closed Voice Commands Guide');
            this.playChime(true);
            return;
        }

        // 5. Voice & Mic Controls
        if (/^(stop listening|stop voice|stop mic|stop|turn off voice|turn off listening|turn off mic|turn off microphone|turn off|turn voice off|turn mic off|shut off|shut down|disable voice|disable mic|mute mic|mute voice|mute|sleep|pause voice|pause listening|pause mic|pause|quit voice|exit voice|deactivate)$/i.test(text) || /(stop listening|turn off (the )?(mic|microphone|voice)|turn (the )?(mic|microphone|voice) off|disable (the )?(mic|voice)|stop recognition)/i.test(text)) {
            this.stopListening();
            this.closeDrawer();
            this.showToast('Voice navigation turned off. Click mic or press V to restart.');
            return;
        }
    }

    jumpTo(elementId, toastMessage) {
        this.closeDrawer();
        const target = document.getElementById(elementId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.focus();
            this.showToast(toastMessage);
            this.playChime(true);
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
