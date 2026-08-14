/**
 * ============================================================================
 * Theme Manager Module
 * Handles Dark, Light, and High Contrast theme toggling, persistence, and WCAG sync.
 * Compatible with local file:// protocol and https:// GitHub Pages.
 * ============================================================================
 */

class ThemeManager {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.themeLabel = document.getElementById('theme-label');

        this.sunSvg = `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        this.moonSvg = `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        this.contrastSvg = `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2V4a8 8 0 1 0 0 16z"/></svg>`;

        this.init();
    }

    init() {
        const currentTheme = this.getCurrentTheme();
        this.updateToggleUI(currentTheme);

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.cycleTheme());
        }

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                }
            });
        }
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    setTheme(theme) {
        if (!['dark', 'light', 'high-contrast'].includes(theme)) return;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleUI(theme);
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    cycleTheme() {
        const currentTheme = this.getCurrentTheme();
        let nextTheme = 'dark';
        if (currentTheme === 'dark') nextTheme = 'light';
        else if (currentTheme === 'light') nextTheme = 'high-contrast';
        else nextTheme = 'dark';

        this.setTheme(nextTheme);
    }

    updateToggleUI(theme) {
        if (!this.themeIcon || !this.themeLabel || !this.themeToggleBtn) return;

        if (theme === 'light') {
            this.themeIcon.innerHTML = this.sunSvg;
            this.themeLabel.textContent = 'Light';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to high contrast theme');
        } else if (theme === 'high-contrast') {
            this.themeIcon.innerHTML = this.contrastSvg;
            this.themeLabel.textContent = 'Contrast';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        } else {
            this.themeIcon.innerHTML = this.moonSvg;
            this.themeLabel.textContent = 'Dark';
            this.themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
        }
    }
}

window.ThemeManager = ThemeManager;
