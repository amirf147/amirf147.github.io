# Portfolio Workspace Rules (amirf147.github.io)

## Core Guidelines

### 1. Accessibility & WCAG Compliance (Mandatory)
- **Screen Reader Context**: Include `<span class="sr-only"> (opens in a new tab)</span>` on all `target="_blank"` links.
- **Decorative Elements**: Mark icons, arrows, and section number prefixes with `aria-hidden="true"`.
- **Media**: Explicit, contextual `alt` for `<img>` and `title` for `<iframe>`.
- **Theme Support**: All elements must support Dark, Light (`[data-theme="light"]`), and High Contrast (`[data-theme="high-contrast"]`).
- **Keyboard Navigation Sync**: Keep single-key shortcuts (`0`–`5`, `t`, `n`/`p`, `?`), `.navigable-item` (`tabindex="-1"`), `.item-nav-bar` links, and `<dialog id="a11y-dialog">` in sync.

### 2. Architecture & Linking
- **Zero-Dependency**: Vanilla HTML5, CSS3 (custom properties), and minimal Vanilla JS. No build tools or frameworks.
- **Relative Linking**: Use relative paths (`./`) for all internal links and assets for GitHub Pages compatibility.

### 3. Verification & Testing Policy
- **Manual User Verification**: Do not perform automated or subagent browser verifications unless explicitly requested by the user. The user always verifies changes manually unless stated otherwise.

### 4. Bilingual Localization & Translation Sync Policy
- **Dual-Language Symmetry**: All pages (`index.html`, `systems-engineering.html`, `test-engineering.html`, `timeline.html`) support seamless English (`en`) and Finnish (`fi`) switching.
- **Data Attributes**: Use `data-i18n`, `data-i18n-html`, and `data-i18n-attr` on all translatable elements.
- **Section Sync Requirement**: Anytime content, sections, badges, or labels are added or modified, update both [`js/i18n/en.js`](./js/i18n/en.js) and [`js/i18n/fi.js`](./js/i18n/fi.js) in authentic professional Finnish (*kirjakieli / asiatyyli*).
- **Mandatory Verification**: Always run `python scripts/check_translations.py` and `python scripts/check_absolute_paths.py` to confirm 100% dictionary symmetry and zero path leaks before completing any task.

