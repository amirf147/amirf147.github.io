/**
 * ============================================================================
 * Keyboard Navigation & Accessibility Module
 * Handles single-key shortcuts (0-4, t, n/p, ?, v), dialog modals, and item stepping.
 * Compatible with local file:// protocol and https:// GitHub Pages.
 * ============================================================================
 */

class KeyboardNav {
    constructor() {
        this.backToTopBtn = document.getElementById('back-to-top');
        this.a11yBtn = document.getElementById('a11y-btn');
        this.a11yDialog = document.getElementById('a11y-dialog');
        this.closeA11yBtn = document.getElementById('close-a11y-btn');
        this.toggleShortcutsInput = document.getElementById('toggle-shortcuts-input');

        this.shortcutsEnabled = localStorage.getItem('enable_shortcuts') !== 'false';

        this.init();
    }

    init() {
        this.setupBackToTop();
        this.setupA11yDialog();
        this.setupKeydownListener();
    }

    setupBackToTop() {
        if (!this.backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        });

        this.backToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const topNav = document.getElementById('top');
        if (topNav) topNav.focus();
    }

    setupA11yDialog() {
        if (!this.a11yDialog) return;

        if (this.a11yBtn) {
            this.a11yBtn.addEventListener('click', () => {
                this.a11yDialog.showModal();
            });
        }

        if (this.closeA11yBtn) {
            this.closeA11yBtn.addEventListener('click', () => {
                this.a11yDialog.close();
                if (this.a11yBtn) this.a11yBtn.focus();
            });
        }

        this.a11yDialog.addEventListener('click', (e) => {
            if (e.target === this.a11yDialog) {
                this.a11yDialog.close();
                if (this.a11yBtn) this.a11yBtn.focus();
            }
        });

        if (this.toggleShortcutsInput) {
            this.toggleShortcutsInput.checked = this.shortcutsEnabled;
            this.toggleShortcutsInput.addEventListener('change', (e) => {
                this.shortcutsEnabled = e.target.checked;
                localStorage.setItem('enable_shortcuts', this.shortcutsEnabled.toString());
            });
        }
    }

    stepProject(direction = 'next') {
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

    jumpToSection(elementId) {
        const target = document.getElementById(elementId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.focus();
        }
    }

    setupKeydownListener() {
        document.addEventListener('keydown', (e) => {
            // Ignore keystrokes when typing inside form inputs
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

            // '?' shortcut toggles A11y dialog regardless of general shortcutsEnabled
            if (e.key === '?') {
                if (this.a11yDialog) {
                    if (this.a11yDialog.open) {
                        this.a11yDialog.close();
                        if (this.a11yBtn) this.a11yBtn.focus();
                    } else {
                        this.a11yDialog.showModal();
                    }
                }
                return;
            }

            // 'v' key shortcut toggles voice navigation
            if (e.key === 'v' || e.key === 'V') {
                window.dispatchEvent(new CustomEvent('togglevoicenav'));
                return;
            }

            if (!this.shortcutsEnabled) return;

            if (e.key === '0') {
                this.jumpToSection('recent-commits-section');
            } else if (e.key === '1') {
                this.jumpToSection('caster-voice-os');
            } else if (e.key === '2') {
                this.jumpToSection('solved-problems');
            } else if (e.key === '3') {
                this.jumpToSection('open-source');
            } else if (e.key === '4') {
                this.jumpToSection('tools');
            } else if (e.key === 't' || e.key === 'T') {
                this.scrollToTop();
            } else if (e.key === 'n' || e.key === 'N') {
                this.stepProject('next');
            } else if (e.key === 'p' || e.key === 'P') {
                this.stepProject('prev');
            }
        });
    }
}

window.KeyboardNav = KeyboardNav;
