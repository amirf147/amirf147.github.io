# Mobile & Layout Architecture Explorations (Reference Archive)

This document archives the design prototypes, architectural patterns, and lessons learned during the August 2026 mobile accessibility refactor and "Two-Column Executive Dossier" layout exploration.

---

## 1. Context & Motivation

* **Audience Context**: Primary portfolio viewers are technical recruiters, hiring managers, and senior engineering leads reviewing candidates from desktop workstations and wide monitors.
* **Goal of Exploration**: Test whether a mobile-first overhaul (touch targets, bottom sheet drawers, horizontal swipe tracks) or a two-column fixed-rail architecture ("Executive Dossier") would enhance scannability while preserving accessibility (WCAG AAA).
* **Outcome / Decision**: Preserved the established desktop-centric linear document architecture (`0fe0cd0`) which provides direct, large-format visibility for code artifacts, PR screenshots, and empirical telemetry without navigational abstraction. The explorations below are archived for future reference.

---

## 2. Explored Directions & Architectural Specs

### Direction A: The Two-Column "Executive Dossier"
* **Concept**: Fixed 360px sticky sidebar on the left containing profile bio, asymmetric scroll-spy Table of Contents, Theme toggle, and social links; right fluid column streaming the technical proof of work.
* **Key Implementation Details**:
  * **Desktop Layout Grid**:
    ```css
    .dossier-layout {
        max-width: 1240px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 360px 1fr;
        gap: 64px;
        min-height: 100vh;
    }
    ```
  * **Vertical Overflow Containment**:
    ```css
    .rail-sidebar {
        position: sticky;
        top: 32px;
        max-height: calc(100vh - 64px);
        overflow-y: auto;
        scrollbar-width: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    ```
  * **Asymmetric IntersectionObserver Scroll-Spy**:
    ```javascript
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('.rail-nav-link').forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    ```

---

### Direction B: Mobile Accessibility & Touch Refinements
* **Pull-to-Refresh & Overscroll Containment**:
  ```css
  .vui-drawer, .lightbox-modal {
      overscroll-behavior-y: contain;
      touch-action: pan-y;
  }
  ```
* **Focus-Aware Scroll Padding for Horizontal Tracks**:
  ```css
  .section-nav-cluster {
      scroll-padding-inline: 20px;
  }
  .section-nav-cluster .nav-btn {
      scroll-margin-inline: 20px;
  }
  ```
* **Hybrid Device Keycap Display Rule**:
  ```css
  /* Hide physical keyboard badges on pure touchscreens (phones/tablets) */
  @media (pointer: coarse) and not (any-pointer: fine) {
      .kbd {
          display: none !important;
      }
  }
  ```
* **Safe Area Offsets for Non-Colliding Floating Actions (FABs)**:
  ```css
  .mobile-voice-fab {
      position: fixed;
      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      left: calc(16px + env(safe-area-inset-left, 0px));
      z-index: 1000;
  }
  .mobile-top-btn {
      position: fixed;
      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      right: calc(16px + env(safe-area-inset-right, 0px));
      z-index: 1000;
  }
  ```
* **Mobile WebKit Speech Lifecycle State**:
  * Track `visibilitychange` and `pagehide` to transition voice HUD to `is-paused` with amber indicator when mobile Safari suspends background microphone audio.

---

## 3. Git Stash Archive Reference

All experimental code and assets from this session are archived in git stash:
* Stash Label: `experimental: mobile-accessibility-and-two-column-dossier`
* To inspect or restore at any time:
  ```powershell
  git stash list
  git stash show -p stash@{0}
  ```
