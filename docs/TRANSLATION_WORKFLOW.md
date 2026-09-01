# Bilingual Localization & Translation Sync Workflow

This repository supports dual-language localization (**English `EN`** and **Finnish `FI`**) across all portfolio pages without any external runtime dependencies or build steps.

---

## 1. Architecture Overview

- **Zero-Dependency Vanilla Architecture**: Translations are driven by lightweight JSON-like dictionaries in [`js/i18n/en.js`](../js/i18n/en.js) and [`js/i18n/fi.js`](../js/i18n/fi.js) and managed by the [`I18nManager`](../js/i18n.js) controller.
- **Pre-Paint Language Detection**: A micro-script in each page's `<head>` inspects `localStorage.getItem('portfolio_lang')` or `navigator.language` and immediately sets `<html lang="en">` or `<html lang="fi">` before rendering to eliminate Content Flash (FOUC).
- **Persistent State**: User language preference is stored in `localStorage` under `portfolio_lang`.
- **Keyboard Shortcut**: Pressing `l` or `L` cycles the language on any page.
- **Reactive Commits Feed**: Commits timestamps (e.g. *1 tunti sitten*, *3 päivää sitten*) react immediately to `window` `languagechange` events.

---

## 2. HTML Markup Conventions

When adding or updating content in any HTML file (`index.html`, `systems-engineering.html`, `test-engineering.html`, `timeline.html`), use the appropriate `data-i18n*` attributes:

### Plain Text (`textContent`)
```html
<span data-i18n="index.hero_title">Amir Farhadi</span>
```

### Formatted HTML (`innerHTML` preserving tags like `<strong>`, `<a>`, `<code>`, `<span class="sr-only">`)
```html
<p data-i18n-html="index.adce_f1">
  <strong>Dual-Engine Topology:</strong> Sub-millisecond Win32 shallow gating...
</p>
```

### Attributes (`aria-label`, `alt`, `title`, `placeholder`)
Pipe-separated attribute key mappings:
```html
<img src="aq-bench.jpg" data-i18n-attr="alt:sys.p1_img1_alt">
<input type="text" data-i18n-attr="placeholder:timeline.search_placeholder|aria-label:timeline.search_label">
```

---

## 3. Translation Sync Requirement

> [!IMPORTANT]
> **Mandatory Rule for Agents & Contributors**:
> Anytime a section, project description, card, or label is modified or added in an HTML file or in English, the corresponding Finnish translation **must** be created/updated in [`js/i18n/fi.js`](../js/i18n/fi.js), and the automated verification script **must** be executed.

### Finnish Translation Quality Standards (*Kirjakieli / Asiatyyli*)
- Use natural, professional, grammatically sound engineering Finnish tailored for Finnish technology employers and recruiters.
- Adhere to standard Finnish engineering terminology:
  - *Embedded Systems / Electronics* → *Sulautetut järjestelmät / Sulautettu elektroniikka*
  - *Systems Administration / Infrastructure* → *Järjestelmäylläpito / IT-infrastruktuuri*
  - *Container Orchestration* → *Konttiorkestraatio / Konttiteknologia*
  - *Hardware-in-the-Loop* → *Hardware-in-the-Loop (HIL) -testaus*
  - *Battery Management System* → *Akunhallintajärjestelmä (BMS)*
  - *Pull Request* → *Pull-request / Muutosehdotus*
  - *Root Cause Analysis* → *Juurisyyanalyysi (RCA)*

---

## 4. Automated Verification Script

Run the verification tool before staging or committing any translation changes:

```powershell
python scripts/check_translations.py
```

### What the Script Verifies:
1. **Dictionary Symmetry**: Asserts that every key in `js/i18n/en.js` exists in `js/i18n/fi.js` and vice-versa.
2. **Value Completeness**: Checks that no translation string is empty or whitespace-only.
3. **100% HTML Coverage**: Scans all `data-i18n`, `data-i18n-html`, and `data-i18n-attr` occurrences across all HTML files and verifies that every key is defined in both dictionaries.
