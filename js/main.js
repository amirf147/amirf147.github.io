/**
 * ============================================================================
 * Main Application Orchestrator
 * Bootstraps modular controllers for Theme, Keyboard Navigation, Commits Feed, and Voice Navigation.
 * Supports both local file:// testing and https:// GitHub Pages.
 * ============================================================================
 */

function bootstrapPortfolio() {
    // 1. Initialize Localization / i18n Controller
    if (window.I18nManager) {
        window.portfolioI18n = new window.I18nManager();
    }

    // 2. Initialize Theme Controller
    if (window.ThemeManager) {
        window.portfolioTheme = new window.ThemeManager();
    }

    // 3. Initialize Keyboard Shortcuts & A11y Controller
    if (window.KeyboardNav) {
        window.portfolioKeyboard = new window.KeyboardNav();
    }

    // 3. Initialize GitHub Commits Live Feed
    if (window.CommitsFeed) {
        window.portfolioCommits = new window.CommitsFeed();
    }

    // 4. Initialize Native Voice Navigation & HUD Overlay
    if (window.VoiceNav) {
        window.portfolioVoice = new window.VoiceNav();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
} else {
    bootstrapPortfolio();
}
