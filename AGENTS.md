# Portfolio Workspace Rules (amirf147.github.io)

## Core Guidelines

### 1. Accessibility & WCAG Compliance (Mandatory)
- **Screen Reader Context**: Include `<span class="sr-only"> (opens in a new tab)</span>` on all `target="_blank"` links.
- **Decorative Elements**: Mark icons, arrows, and section number prefixes with `aria-hidden="true"`.
- **Media**: Explicit, contextual `alt` for `<img>` and `title` for `<iframe>`.
- **Theme Support**: All elements must support Dark, Light (`[data-theme="light"]`), and High Contrast (`[data-theme="high-contrast"]`).
- **Keyboard Navigation Sync**: Keep single-key shortcuts (`0`–`4`, `t`, `n`/`p`, `?`), `.navigable-item` (`tabindex="-1"`), `.item-nav-bar` links, and `<dialog id="a11y-dialog">` in sync.

### 2. Architecture & Linking
- **Zero-Dependency**: Vanilla HTML5, CSS3 (custom properties), and minimal Vanilla JS. No build tools or frameworks.
- **Relative Linking**: Use relative paths (`./`) for all internal links and assets for GitHub Pages compatibility.
