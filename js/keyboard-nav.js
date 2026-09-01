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
        this.cvBtn = document.getElementById('cv-btn');
        this.cvDialog = document.getElementById('cv-dialog');
        this.closeCvBtn = document.getElementById('close-cv-btn');
        this.toggleShortcutsInput = document.getElementById('toggle-shortcuts-input');

        this.shortcutsEnabled = localStorage.getItem('enable_shortcuts') !== 'false';

        this.init();
    }

    init() {
        this.setupBackToTop();
        this.setupA11yDialog();
        this.setupCvDialog();
        this.setupKeydownListener();
    }

    setupBackToTop() {
        if (this.backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 150) {
                    this.backToTopBtn.classList.add('visible');
                } else {
                    this.backToTopBtn.classList.remove('visible');
                }
            });

            this.backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Intercept any <a href="#top"> clicks to ensure clean (0, 0) scroll without clipping the top utility bar
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href="#top"]');
            if (link) {
                e.preventDefault();
                this.scrollToTop();
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, '#top');
                }
            }
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const topNav = document.getElementById('top');
        if (topNav) {
            topNav.focus({ preventScroll: true });
        }
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

    setupCvDialog() {
        if (!this.cvDialog) return;

        if (this.cvBtn) {
            this.cvBtn.addEventListener('click', () => {
                this.cvDialog.showModal();
            });
        }

        if (this.closeCvBtn) {
            this.closeCvBtn.addEventListener('click', () => {
                this.cvDialog.close();
                if (this.cvBtn) this.cvBtn.focus();
            });
        }

        this.cvDialog.addEventListener('click', (e) => {
            if (e.target === this.cvDialog) {
                this.cvDialog.close();
                if (this.cvBtn) this.cvBtn.focus();
            }
        });
    }

    stepProject(direction = 'next') {
        const projects = Array.from(document.querySelectorAll('.navigable-item'));
        if (!projects.length) return;

        // Check if currently focused element belongs to a project currently visible in the viewport
        const activeElement = document.activeElement;
        const activeProject = activeElement ? activeElement.closest('.navigable-item') : null;
        let isFocusVisible = false;

        if (activeProject) {
            const activeRect = activeProject.getBoundingClientRect();
            // Consider visible if within the active viewport reading zone
            isFocusVisible = (activeRect.top >= -80 && activeRect.top < window.innerHeight * 0.75);
        }

        let target = null;

        if (direction === 'next') {
            if (isFocusVisible && activeProject) {
                const activeIdx = projects.indexOf(activeProject);
                if (activeIdx !== -1 && activeIdx < projects.length - 1) {
                    target = projects[activeIdx + 1];
                }
            }
            // If focus is off-screen or not set, find based on current viewport scroll position
            if (!target) {
                for (const project of projects) {
                    const rect = project.getBoundingClientRect();
                    if (rect.top > 80) {
                        target = project;
                        break;
                    }
                }
                // Fallback to last item if past all items
                if (!target && projects.length > 0) {
                    target = projects[projects.length - 1];
                }
            }
        } else {
            // Previous
            if (isFocusVisible && activeProject) {
                const activeIdx = projects.indexOf(activeProject);
                if (activeIdx > 0) {
                    target = projects[activeIdx - 1];
                }
            }
            if (!target) {
                for (let i = projects.length - 1; i >= 0; i--) {
                    const project = projects[i];
                    const rect = project.getBoundingClientRect();
                    if (rect.top < -40) {
                        target = project;
                        break;
                    }
                }
                // Fallback to first item if near top
                if (!target && projects.length > 0) {
                    target = projects[0];
                }
            }
        }

        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

            // 'c' or 'C' shortcut toggles CV download dialog
            if (e.key === 'c' || e.key === 'C') {
                if (this.cvDialog) {
                    if (this.cvDialog.open) {
                        this.cvDialog.close();
                        if (this.cvBtn) this.cvBtn.focus();
                    } else {
                        this.cvDialog.showModal();
                    }
                }
                return;
            }

            // 'v' key shortcut toggles voice navigation
            if (e.key === 'v' || e.key === 'V') {
                window.dispatchEvent(new CustomEvent('togglevoicenav'));
                return;
            }

            // 'l' key shortcut toggles language (EN / FI)
            if (e.key === 'l' || e.key === 'L') {
                window.dispatchEvent(new CustomEvent('togglelanguage'));
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
            } else if (e.key === '5') {
                this.jumpToSection('academic-projects');
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
