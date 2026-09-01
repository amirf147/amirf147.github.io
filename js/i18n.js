/**
 * ============================================================================
 * Internationalization (i18n) Manager Module
 * Handles English and Finnish language toggling, persistence, DOM updates,
 * attribute localization (aria-label, title, alt), and WCAG compliance.
 * Compatible with local file:// protocol and https:// GitHub Pages.
 * ============================================================================
 */

class I18nManager {
    constructor() {
        this.langToggleBtn = document.getElementById('lang-toggle');
        this.langLabel = document.getElementById('lang-label');
        this.langIcon = document.getElementById('lang-icon');

        this.globeSvg = `<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;

        this.currentLang = this.detectInitialLanguage();
        this.init();
    }

    detectInitialLanguage() {
        const saved = localStorage.getItem('portfolio_lang');
        if (saved && (saved === 'fi' || saved === 'en')) {
            return saved;
        }
        if (navigator && navigator.language && navigator.language.toLowerCase().startsWith('fi')) {
            return 'fi';
        }
        return 'en';
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.applyLanguage(this.currentLang, false);

        if (this.langToggleBtn) {
            this.langToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });
        }

        // Listen for keyboard shortcut triggers
        window.addEventListener('togglelanguage', () => {
            this.toggleLanguage();
        });
    }

    getLanguage() {
        return this.currentLang;
    }

    setLanguage(lang) {
        if (lang !== 'en' && lang !== 'fi') return;
        this.currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        this.applyLanguage(lang, true);
    }

    toggleLanguage() {
        const nextLang = this.currentLang === 'en' ? 'fi' : 'en';
        this.setLanguage(nextLang);
    }

    resolveKey(dict, keyPath) {
        if (!dict || !keyPath) return null;
        const keys = keyPath.split('.');
        let current = dict;
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        return current;
    }

    applyLanguage(lang, shouldEmitEvent = true) {
        document.documentElement.setAttribute('lang', lang);

        const dict = (window.I18N_DICTS && window.I18N_DICTS[lang]) ? window.I18N_DICTS[lang] : null;
        const enFallback = (window.I18N_DICTS && window.I18N_DICTS['en']) ? window.I18N_DICTS['en'] : null;

        if (dict) {
            // 1. Text translations (data-i18n)
            const textElements = document.querySelectorAll('[data-i18n]');
            textElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                let translation = this.resolveKey(dict, key);
                if (translation === null && enFallback) {
                    translation = this.resolveKey(enFallback, key);
                }
                if (translation !== null && typeof translation === 'string') {
                    el.textContent = translation;
                }
            });

            // 2. Rich HTML translations (data-i18n-html)
            const htmlElements = document.querySelectorAll('[data-i18n-html]');
            htmlElements.forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                let translation = this.resolveKey(dict, key);
                if (translation === null && enFallback) {
                    translation = this.resolveKey(enFallback, key);
                }
                if (translation !== null && typeof translation === 'string') {
                    el.innerHTML = translation;
                }
            });

            // 3. Attribute translations (data-i18n-attr="attrName:key|attrName2:key2")
            const attrElements = document.querySelectorAll('[data-i18n-attr]');
            attrElements.forEach(el => {
                const spec = el.getAttribute('data-i18n-attr');
                if (!spec) return;
                const pairs = spec.split('|');
                for (const pair of pairs) {
                    const colonIdx = pair.indexOf(':');
                    if (colonIdx === -1) continue;
                    const attrName = pair.substring(0, colonIdx).trim();
                    const key = pair.substring(colonIdx + 1).trim();

                    let translation = this.resolveKey(dict, key);
                    if (translation === null && enFallback) {
                        translation = this.resolveKey(enFallback, key);
                    }
                    if (translation !== null && typeof translation === 'string') {
                        el.setAttribute(attrName, translation);
                    }
                }
            });
        }

        this.updateToggleUI(lang);

        if (shouldEmitEvent) {
            window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
        }
    }

    updateToggleUI(lang) {
        if (!this.langToggleBtn) {
            this.langToggleBtn = document.getElementById('lang-toggle');
        }
        if (!this.langLabel) {
            this.langLabel = document.getElementById('lang-label');
        }
        if (!this.langIcon) {
            this.langIcon = document.getElementById('lang-icon');
        }

        if (this.langIcon && !this.langIcon.innerHTML) {
            this.langIcon.innerHTML = this.globeSvg;
        }

        if (this.langLabel) {
            if (lang === 'fi') {
                this.langLabel.textContent = 'Suomi (FI)';
            } else {
                this.langLabel.textContent = 'English (EN)';
            }
        }

        if (this.langToggleBtn) {
            if (lang === 'fi') {
                this.langToggleBtn.setAttribute('aria-label', 'Vaihda kieleksi englanti / Switch to English');
                this.langToggleBtn.setAttribute('title', 'Vaihda kieleksi englanti (L)');
                this.langToggleBtn.setAttribute('data-tooltip', 'Vaihda kieleksi englanti [L]');
            } else {
                this.langToggleBtn.setAttribute('aria-label', 'Switch to Finnish / Vaihda kieleksi suomi');
                this.langToggleBtn.setAttribute('title', 'Switch to Finnish (L)');
                this.langToggleBtn.setAttribute('data-tooltip', 'Switch to Finnish [L]');
            }
        }
    }
}

// Global registry for dictionaries
window.I18N_DICTS = window.I18N_DICTS || {};
window.I18nManager = I18nManager;
