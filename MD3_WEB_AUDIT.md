# Material 3 for the Web — Completeness Audit

> Status: **initial source audit / investigation plan**  
> Scope: the `appsweep-web` static website only. This document does not claim that the site is fully Material 3 compliant, and it does not prescribe a wholesale redesign.

## Purpose

Establish an evidence-based inventory of the website against the current Material 3 (M3) design system and relevant web-platform guidance. Record:

- M3 foundations and component patterns that are missing or only partially implemented.
- Existing implementations that are close to M3 but have incorrect tokens, states, dimensions, semantics, or behavior.
- Site-specific styling that is redundant, duplicated, inconsistent, or not justified by an M3 pattern.
- M3 components and capabilities that are intentionally out of scope because the website has no corresponding user need.
- A prioritized implementation plan with measurable acceptance criteria.

The audit is deliberately open-ended. It has no fixed completion date. Findings must be verified against the actual pages, CSS, JavaScript, browser behavior, and authoritative references before being treated as confirmed defects.

## Scope and constraints

- Repository: `PanDuroDev/appsweep-web` (not the AppSweep desktop application repository).
- Pages: `index.html`, `docs.html`, `releases.html`, and `release.html`.
- Implementation: semantic HTML, CSS custom properties, and vanilla JavaScript; no frontend framework or build step is currently used.
- Keep the static-site architecture unless an evidence-backed reason justifies changing it.
- Preserve the established dark-first, neutral/monochrome visual identity unless the owner explicitly approves a brand-direction change.
- M3 is a design system, not a requirement to add every component to every site. Only introduce a component when the information architecture and interaction require it.
- Do not treat Compose/Android-only behavior as a Web requirement. Distinguish core M3 guidance, M3 Expressive guidance, Material Web component implementation details, and browser/WCAG requirements.
- Do not add Material Web as a dependency merely to obtain visual parity. Evaluate its current maintenance/support status and the cost of introducing it before considering adoption.

## Current implementation inventory (observed in source)

| Area | Existing implementation | Initial assessment |
|---|---|---|
| Theme | Dark default and light theme via `:root[data-theme]`; persisted preference in local storage | Present; palette roles and contrast need systematic verification |
| Color roles | Primary, secondary, tertiary, error, surface, outline, inverse, tint, and surface-container roles | Broad role coverage; several roles are intentionally neutral/monochrome, and the light/dark schemes need contrast and tonal-relationship checks |
| Typography | Display, headline, title, body, and label tokens; Roboto Flex loaded from Google Fonts | Full role names exist; actual usage, font fallback, variable axes, scale behavior, and the unused local Google Sans Flex asset need review |
| Shape | M3-named corner tokens from none through full, including increased variants | Broad scale exists; every use and the consistency of component-to-shape mapping need auditing |
| Spacing/layout | App-owned 8px-step spacing tokens, 1920px content maximum, responsive page layouts | Responsive work exists; token coverage, grid alignment, density, and breakpoint behavior need measurement |
| Elevation/surfaces | Surface-container roles and mostly flat outlined/filled panels; no decorative shadows | Tonal surface approach exists; elevation levels, tonal hierarchy, and any unnecessary borders need review |
| Motion | App-owned easing/duration tokens, short transitions, progress rotation, reduced-motion handling | Partial implementation; curves, durations, state transitions, interruption, and motion semantics need validation |
| State layers | Hover/focus/pressed opacity tokens and CSS `color-mix()` overlays on controls/navigation | Present as a custom implementation; verify against M3 state-layer behavior and ensure states are not conflated |
| Buttons | Filled, tonal, outlined, quiet, icon, and small variants | Several familiar treatments exist; exact component mapping, disabled behavior, icon spacing, and responsive sizing need review |
| App bar/navigation | Sticky top app bar, desktop links, custom collapsible mobile navigation | Site-specific pattern; compare against M3 top-app-bar and navigation guidance, including mobile interaction and focus behavior |
| Cards/content surfaces | Bordered project/release/asset panels using surface-container colors | Similar to outlined/filled cards; verify variants, padding, shape, hierarchy, and whether some panels are unnecessary |
| Progress/feedback | Custom loading ring, empty/error/retry states, release availability labels | Functional states exist; compare progress indicator, supporting text, live announcements, and status semantics with M3/Web accessibility |
| Accessibility | Skip link, visible focus styles, labels/landmarks, several ARIA states, forced-colors CSS, reduced motion | Good foundations; needs a page-by-page keyboard, screen-reader, zoom, contrast, and touch-target audit |
| Icons | Material Symbols Outlined ligature font | Consistent family; verify glyph availability, accessible naming, optical sizing, and loading/fallback behavior |
| Documentation navigation | In-page section links with current-location state; sticky side rail at wide widths | Useful site pattern; not automatically equivalent to M3 tabs or navigation rail—verify selection semantics and responsive transformation |

This inventory is a starting point, not a compliance score. Presence of a token or CSS class does not prove that its rendered result follows M3.

## Initial findings to verify

These are evidence-led audit candidates from the current source, not all confirmed defects.

### 1. Color system and theme generation

- Dark primary, secondary, and tertiary currently share neutral values; the light theme also uses a predominantly neutral palette. Confirm whether a monochrome scheme is the intentional brand decision or an accidental loss of M3 role distinction.
- Verify every foreground/background pairing in both themes, including text, icons, outlines, disabled controls, focus indicators, and state layers. Test computed colors, not only token names.
- Check whether all color roles used by the pages have a valid value in both themes, and whether unused roles should remain as supported theme contract or be removed.
- Check that the HTML theme-color metadata and JavaScript theme updates remain synchronized with the actual surface tokens.
- Identify hard-coded colors outside the theme layer and classify each as a necessary platform/browser integration value or an avoidable duplicate.

### 2. Typography and font assets

- Compare every rendered text style with the M3 type roles, including weight, line-height, tracking, and responsive scaling—not just font-size.
- Verify heading hierarchy and reading measure on all pages, including long release names, file names, and release notes.
- Confirm the intended typeface. The repository contains a local Google Sans Flex subset while the current stylesheet loads Roboto Flex remotely; determine whether the local asset is unused, a fallback candidate, or an accidental leftover before removing or adopting it.
- Check font loading failure, layout shift, variable-font support, and browser fallback behavior.

### 3. Shape, spacing, and layout

- Map each component class to a named M3 shape role. Flag arbitrary values, mixed radii within the same component family, and cases where an increased corner is used without a clear interaction rationale.
- Audit spacing values and component padding against the layout grid. Do not force every measurement to an 8px multiple; document the actual grid and its exceptions.
- Test compact, medium, expanded, and very wide viewports. Verify content order, reading width, navigation, cards, release asset columns, and absence of horizontal overflow.
- Review whether the 1920px content maximum and page margins remain usable at large screens and at 200% zoom.

### 4. Surface, outline, and elevation

- Map each panel to the appropriate M3 card/surface pattern: elevated, filled, or outlined. A border plus a surface fill should not be applied by habit.
- Verify the hierarchy between page surface, app bar, content containers, nested panels, and interactive surfaces in both themes.
- Confirm that no component uses a shadow/elevation treatment that conflicts with the intended flat visual language, and that overlays (if any are introduced) use scrims and stacking behavior appropriately.
- Remove duplicate borders or nested containers when they do not communicate a meaningful grouping.

### 5. Components and interaction patterns

Audit only components present or justified by the site:

- Buttons: filled, tonal, outlined, text/quiet, icon-only, disabled, loading, and link-button semantics.
- Top app bar and responsive navigation: scroll behavior, selected/current state, menu disclosure, dismissal, focus order, Escape behavior, and focus restoration.
- Cards and lists: interactive versus non-interactive semantics, content grouping, and action placement.
- Progress indicators: loading state, determinate/indeterminate meaning, accessible name/status, and reduced-motion behavior.
- Feedback: inline errors, empty states, retry actions, and announcements when asynchronous release data changes.
- In-page navigation: current section indication, anchor offset, keyboard navigation, and narrow-screen usability.
- Links: external-link indication where useful, visited/focus/active states, and distinction from buttons.

Do not add dialogs, menus, tabs, snackbars, text fields, checkboxes, FABs, navigation drawers, or other M3 components solely to increase a component checklist. Add them only if a real website workflow requires them.

### 6. State layers and motion

- Verify hover, focus, pressed, dragged, selected, and disabled as distinct states where applicable. Do not let `:focus-visible` accidentally inherit hover styling or use one overlay for every state.
- Compare the current app-owned opacity values and color mixing with the applicable M3 component guidance. Keep app-owned tokens namespaced as `--app-*`; do not invent non-standard `--md-sys-*` or component-token names.
- Confirm motion communicates state and hierarchy rather than decoration. Check duration/easing per interaction, transition properties, interrupted interactions, and reduced-motion behavior.
- Review the button/navigation corner morph as an M3 Expressive choice, not as a universal requirement for all M3 Web controls. Keep or remove it based on the correct Web guidance and observed usability.
- Check the custom loading spinner against the current M3 progress-indicator pattern and ensure it does not imply measurable progress when the request is indeterminate.

### 7. Accessibility and web platform behavior

- Target WCAG 2.2 AA as the web accessibility baseline in addition to M3 guidance.
- Test contrast for normal/large text, non-text controls, focus indicators, selected states, and disabled states; document cases where disabled contrast exemptions apply rather than assuming every token pair passes.
- Verify keyboard-only use, visible and unobscured focus, logical focus order, skip navigation, menu focus behavior, and no keyboard traps.
- Verify accessible names, landmarks, heading order, link purpose, button semantics, `aria-expanded`, `aria-controls`, `aria-current`, `aria-busy`, and status/error announcements.
- Test 200% and 400% zoom, text resizing, narrow viewport reflow, forced colors, reduced motion, and touch targets.
- Check asynchronous GitHub API loading and retry feedback with a screen reader. A visual state change alone is not necessarily announced.

### 8. Code and token hygiene

- Build a token-usage report: declared tokens, referenced tokens, undeclared tokens, duplicate declarations, literal values, and unused tokens.
- Separate M3 system/reference tokens from app-specific layout, state, and motion tokens. App-specific tokens must retain the `--app-*` prefix.
- Find repeated component declarations and page-specific overrides that should share a component rule.
- Identify unused CSS selectors, dead JavaScript, duplicate initialization, unused assets, and obsolete comments/documentation.
- Keep the CSS cache-busting and static validation rules compatible with independently versioned stylesheets.

## What is not automatically missing

The following should not be reported as defects without a product requirement:

- A Material Web custom element for every control. Semantic native HTML with correct styling and behavior can be the better web implementation.
- Android/Compose-specific APIs, animations, or layout behaviors that have no equivalent Web requirement.
- Dynamic color generated from wallpaper or a user image. The website may intentionally use a fixed monochrome brand scheme.
- Every M3 component category. The website is primarily informational and release-focused; unused components add complexity.
- Decorative elevation, gradients, blur, or animation. M3 does not require these effects everywhere.
- A literal 8px-only spacing system. Layout grids use a rhythm, but component metrics and optical adjustments still need to follow the relevant guidance.

## Audit method and evidence requirements

For each finding, record:

1. **Location** — page, selector/component, file, and line or DOM evidence.
2. **Observed behavior** — what the site currently renders or does.
3. **Reference rule** — exact M3 Web/component guidance or WCAG success criterion and link.
4. **Classification** — missing, incorrect, inconsistent, redundant, unnecessary, or already correct.
5. **Severity** — blocker, high, medium, low, or informational, based on user impact.
6. **Recommendation** — the smallest coherent correction; include alternatives where brand intent affects the choice.
7. **Validation** — automated test, computed-style/contrast check, keyboard/screen-reader test, and viewport(s) required.
8. **Decision** — accepted, rejected with rationale, deferred, or needs product-owner input.

Do not label something “M3 violation” based only on a resemblance or a third-party checklist. Cite the authoritative component/foundation guidance and distinguish normative requirements from recommendations.

## Proposed work sequence

- [ ] **Phase 1 — Baseline capture:** record current screenshots and behavior for all four pages at compact, medium, expanded, and wide viewports, in both themes.
- [ ] **Phase 2 — Foundations audit:** color roles/contrast, typography, shape, spacing, surfaces/elevation, motion, and responsive layout.
- [ ] **Phase 3 — Component audit:** app bar/navigation, buttons, cards, progress, feedback, links, and in-page navigation.
- [ ] **Phase 4 — Accessibility audit:** keyboard, screen reader, zoom/reflow, forced colors, reduced motion, and touch targets.
- [ ] **Phase 5 — Redundancy and code hygiene:** unused tokens/assets/selectors, duplicated rules, hard-coded values, and inaccurate documentation.
- [ ] **Phase 6 — Prioritized backlog:** turn verified findings into small, reviewable implementation tasks; avoid one untestable visual rewrite.
- [ ] **Phase 7 — Implementation and regression:** update components/tokens in coherent groups, add tests, compare screenshots, and verify GitHub Pages deployment.

## Acceptance criteria for closing the audit

- Every page and interactive component has been inventoried.
- Each M3 foundation has an explicit status: compliant, partial, non-compliant, not applicable, or pending evidence.
- Every reported issue has a source location, authoritative reference, impact, recommendation, and validation method.
- Redundant and unnecessary elements are listed separately from missing functionality.
- Brand decisions (especially monochrome color and expressive motion) are separated from objective implementation defects.
- The final backlog is prioritized and contains no speculative or duplicate findings.
- No implementation is merged solely because it appears on a generic M3 component checklist.

## References

### Material 3 and Material Web
- [Material 3 — Design system](https://m3.material.io/)
- [Material 3 — Color](https://m3.material.io/styles/color/overview)
- [Material 3 — Typography](https://m3.material.io/styles/typography/overview)
- [Material 3 — Shape](https://m3.material.io/styles/shape/overview)
- [Material 3 — Elevation](https://m3.material.io/styles/elevation/overview)
- [Material 3 — Motion](https://m3.material.io/styles/motion/overview)
- [Material 3 — Layout](https://m3.material.io/foundations/layout/overview)
- [Material 3 — Components](https://m3.material.io/components)
- [Material Web documentation](https://github.com/material-components/material-web/tree/main/docs)

### Web accessibility
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI — Essential components of web accessibility](https://www.w3.org/WAI/fundamentals/components/)

---

**Important:** this document is the audit charter and initial source inventory. It is not the final compliance report. Findings must be expanded and verified through the remaining audit phases before implementation decisions are made.
