# Material 3 for the Web — Completeness Audit

> Status: **findings resolved in source; local verification complete; final assistive-technology checks remain**
>
> Scope: the `appsweep-web` static website only. This document does not claim that the site is fully Material 3 compliant, and it does not prescribe a wholesale redesign.
>
> The sections below are retained as the chronological audit record. The final [resolution update](#resolution-update--2026-10-30-fixes-implemented-and-verified) supersedes their open-status statements.

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
- The only permitted brand-specific design-property exception is the palette `#111111` and `#eaeaea`. All other applicable properties must follow current Material 3 Web guidance; these values do not excuse incorrect semantic roles, contrast, typography, shape, layout, surfaces, states, or motion.
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

- The monochrome palette is a binding product constraint: `#111111` and `#eaeaea` are the only allowed brand-specific exception. Audit how these values map to semantic roles and verify every other role, tonal relationship, and contrast requirement against M3 Web guidance.
- Verify every foreground/background pairing in both themes, including text, icons, outlines, disabled controls, focus indicators, and state layers. Test computed colors, not only token names.
- Check whether all color roles used by the pages have a valid value in both themes, and whether unused roles should remain as supported theme contract or be removed.
- Check that the HTML theme-color metadata and JavaScript theme updates remain synchronized with the actual surface tokens.
- Find every hard-coded color outside the theme layer. Only `#111111` and `#eaeaea` are allowed as explicit brand exceptions; every other color must be justified by the applicable M3 semantic role/platform requirement or corrected.

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

- [x] **Phase 1 — Baseline capture:** record current screenshots and behavior for all four pages at compact, medium, expanded, and wide viewports, in both themes.
- [x] **Phase 2 — Foundations audit:** color roles/contrast, typography, shape, spacing, surfaces/elevation, motion, and responsive layout.
- [x] **Phase 3 — Component audit:** app bar/navigation, buttons, cards, progress, feedback, links, and in-page navigation.
- [ ] **Phase 4 — Accessibility audit:** keyboard, screen reader, zoom/reflow, forced colors, reduced motion, and touch targets. Automated and browser checks are complete; screen-reader, forced-colors, and zoom sessions remain.
- [x] **Phase 5 — Redundancy and code hygiene:** unused tokens/assets/selectors, duplicated rules, hard-coded values, and inaccurate documentation.
- [x] **Phase 6 — Prioritized backlog:** turn verified findings into small, reviewable implementation tasks; avoid one untestable visual rewrite.
- [x] **Phase 7 — Implementation and regression:** update components/tokens in coherent groups, add tests, compare screenshots, and verify GitHub Pages deployment.

## Acceptance criteria for closing the audit

- Every page and interactive component has been inventoried.
- Each M3 foundation has an explicit status: compliant, partial, non-compliant, not applicable, or pending evidence.
- Every reported issue has a source location, authoritative reference, impact, recommendation, and validation method.
- Redundant and unnecessary elements are listed separately from missing functionality.
- The `#111111` / `#eaeaea` palette exception is enforced; no other design-property exception is assumed. Any technical limitation must be evidenced and documented.
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

**Historical note:** the material above is the audit charter, initial source inventory, and chronological evidence log. The resolution section below records the implemented fixes and the checks completed after those entries were written.

## Live evidence update — 2026-10-30: styles.css first color/state pass

### Verified source scope
- Reviewed styles.css focus outline, links, app-bar navigation, filled/tonal/outlined/quiet buttons, card/notice/release surfaces, docs navigation, loading indicator, reduced-motion and forced-colors rules.
- Cross-checked state-layer values directly against the generated Material Web v0.192 source: [_md-sys-state.scss](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss). Exact values: hover 0.08, focus 0.12, pressed 0.12, dragged 0.16.
- Cross-checked button reference dimensions against generated Material Web v0.192 component tokens: [filled button](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss) and [filled icon button](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-icon-button.scss).

### Computed foreground/background results
Ratios were calculated from the actual declared hex values in tokens.css. Each row represents the five backgrounds surface, surface-container-low, surface-container, surface-container-high, and surface-container-highest.

| Theme | Foreground role | Lowest ratio across the five surfaces | WCAG AA normal text |
|---|---|---:|---|
| Dark | on-surface | 10.97:1 | Pass |
| Dark | on-surface-variant | 7.73:1 | Pass |
| Dark | primary (used by links and emphasis) | 7.73:1 | Pass |
| Light | on-surface | 13.05:1 | Pass |
| Light | on-surface-variant | 7.04:1 | Pass |
| Light | primary (used by links and emphasis) | 13.05:1 | Pass |

The primary focus outline was also checked against all five surfaces: its lowest ratio is 7.73:1 in dark mode and 13.05:1 in light mode. The standard outline role remains above 3:1 against all five surfaces (minimum 4.13:1 dark, 3.44:1 light).

### Outline-variant classification — pending, not a confirmed WCAG defect
The outline-variant border color is below 3:1 against all five surface-container backgrounds (range 1.42–2.03:1 dark; 1.31–1.58:1 light). It is currently used on section separators and non-interactive grouping surfaces/cards. WCAG 1.4.11 applies when the visual boundary is necessary to identify a UI component or its state; a decorative/grouping border does not automatically need 3:1. The actual page semantics and rendered grouping must be assessed before raising a confirmed accessibility defect. Keep this item open pending component-by-component classification.

### Interaction-state review
- Shared button and navigation state rules correctly distinguish hover, focus-visible, and active/pressed selectors; selected/current navigation states have separate base and interaction rules.
- The shared focus indicator is a 2px primary outline with 2px offset. Its token contrast is strong against all currently declared content surfaces.
- The confirmed mismatch remains the shared focus/pressed opacity token (10% instead of 12%); it affects filled/tonal/outlined/quiet buttons and both navigation groups.
- The CSS explicitly disables the loading-indicator animation and component transitions under prefers-reduced-motion: reduce; forced-colors overrides are present. This is source-level evidence only, not browser verification.

### Progress/loading and accessibility follow-up
- The loading indicator is a custom 40px ring with a 3px border and 1400ms linear rotation. Its motion is disabled under reduced-motion. Material Web documents circular progress as an indeterminate circular indicator and exposes size/indicator-width tokens; the current source inspection alone does not establish a defect in the chosen custom rendering.
- Release loading containers set aria-busy, while the spinner is intentionally aria-hidden and visible loading text is provided. Retry/loading/error transitions still need a screen-reader check to establish whether status changes are announced adequately (WCAG 4.1.3).
- No browser-computed-style, screenshot, keyboard, or screen-reader verification has been performed in this pass.

### Status
- [x] Calculate the actual text-role combinations against all five surface-container backgrounds in both themes.
- [x] Check focus-outline and standard-outline contrast against the same surfaces.
- [x] Inspect CSS state selectors for hover/focus/pressed separation and selected navigation variants.
- [x] Confirm the source-level reduced-motion and forced-colors rules.
- [ ] Classify every outline-variant use as decorative versus necessary component/state boundary.
- [ ] Verify release loading/retry/error announcements with a screen reader.
- [ ] Perform browser-computed-style and visual checks.
- [ ] Resolve confirmed findings and run regression checks.

## Live evidence update — 2026-10-30: documentation typography override

### Finding F-STYLES-01 — Body line-height overrides
- **Classification:** confirmed M3 typography-token mismatch.
- **Severity:** Low; visual consistency/readability. No clipping or functional failure has been established.
- **Locations:** styles.css lines 905–912 and 944–949.
- **Evidence:** The docs-fact/detail-list/steps supporting-text selector uses the Body Medium font size (14px) but overrides line-height with 1.65 (23.1px), instead of the Body Medium token of 20px. The docs-steps/checklist list-item selector also uses 1.65; with inherited Body Large 16px this computes to 26.4px instead of the Body Large token of 24px.
- **Recommendation:** Restore the corresponding M3 line-height tokens and ensure each selector uses a coherent type role (font, size, weight, line-height, tracking). Do not add a custom line-height exception just to loosen the reading rhythm.
- **Validation:** Compare computed typography against Body Medium (14/20) and Body Large (16/24); review line wrapping and readability at compact, medium, and wide widths; add a regression assertion.
- **Reference:** [Material 3 Typography](https://m3.material.io/styles/typography/overview).

This finding is documented in PR discussion. No source changes have been made. The styles.css file-level checklist remains unchecked until all CSS findings are resolved and validated.

### Additional source scan notes
A scan of literal CSS values also found layout widths, icon sizes, 40px brand/progress dimensions, 2px/3px optical offsets, and responsive grid constraints. These are not automatically defects: each needs comparison with the relevant component/layout guidance and rendered context. No speculative issue has been opened for them in this pass.

## Live evidence update — 2026-10-30: page theme metadata cross-check

- [x] Inspect all four page HTML files for inline style attributes and literal color values.
- [x] Verify each page declares the dark initial theme-color metadata value (#111111).
- [x] Verify app.js updates the theme-color metadata to #111111 for dark mode and #f5f5f5 for light mode, matching the corresponding semantic surface colors in tokens.css.
- [x] Confirm no inline style declarations or additional hard-coded color literals were found in the four page HTML files during this scan.

**Assessment:** No color-policy finding from this check. The light-mode #f5f5f5 value is the defined M3 surface role used for browser chrome metadata, not an additional brand-palette exception. The HTML/CSS/JS source relationship is consistent. Browser chrome rendering still needs device/browser verification.

## Live evidence update — 2026-10-30: asynchronous status semantics and asset typography

### Finding F-A11Y-01 — Release async state announcements
- **Classification:** likely WCAG 2.2 SC 4.1.3 Status Messages failure; medium severity.
- **Affected:** releases.html and release.html; releases.js.
- **Evidence:** The list/detail containers toggle aria-busy, but their loading, empty, and error messages are not exposed through role=status, role=alert, or aria-live. releases.js changes their visibility during fetch/retry. The detail page also updates per-platform availability text without a live region. The homepage uses role=status/aria-live for its ready/error blocks, so the announcement pattern is inconsistent across the pages.
- **Impact:** Screen-reader users may not be notified when asynchronous loading finishes, no release is found, a fetch fails, or platform assets become available.
- **Recommendation:** Add a concise persistent live status region to each list/detail view and update it on loading, ready/empty, and error. Keep the detailed cards and asset lists outside the live region to avoid large announcements. Verify initial load and retry with a screen reader.
- **Reference:** [WCAG 2.2 SC 4.1.3](https://www.w3.org/TR/WCAG22/#status-messages).
- **Verification:** Source inspection only; assistive-technology behavior remains to be confirmed.

### Finding F-STYLES-02 — Mixed type roles on asset filenames
- **Classification:** confirmed mixed M3 type-role declaration; low severity.
- **Location:** styles.css lines 660–664 (.asset-row__name).
- **Evidence:** The selector combines Body Medium family/size/line-height (14px/20px) with Title Medium weight 500 and inherits Body Medium tracking. Material 3 Title Small is the coherent role matching 14px/20px/500, with its own tracking token.
- **Recommendation:** Apply the complete Title Small token set or use Body Medium consistently. Do not mix a single weight property from another role.
- **Reference:** [Material Web v0.192 generated type scale](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss).
- **Verification:** Source inspection; no browser computed styles have been claimed.

### Status
- [x] Inspect release list/detail asynchronous loading, empty, error, retry, and platform-availability DOM states.
- [x] Compare live-region semantics on the homepage against releases and release-detail pages.
- [x] Record F-A11Y-01 and F-STYLES-02 in the PR discussion and audit log.
- [ ] Add and test persistent concise live status announcements for release list/detail.
- [ ] Align asset filename typography with one complete M3 role.
- [ ] Re-run accessibility and typography regression checks after fixes.

## Live evidence update — 2026-10-30: CSS hygiene, documentation, and font-asset pass

### Token and CSS hygiene scan (source-only)
- Scanned the complete current `tokens.css` declaration set against the complete `styles.css` variable references.
- Found no undeclared custom-property references in `styles.css`.
- Found no raw hexadecimal/RGB/HSL color literals in `styles.css`; the forced-colors rules use system colors (`CanvasText` and `Highlight`), which are platform accessibility colors rather than palette exceptions.
- The repeated semantic color declarations in `:root[data-theme="light"]` are theme overrides, not duplicate declarations to remove.
- Several declared color and typography roles are not directly consumed by the current CSS. This is not automatically a defect: unused roles may be retained as a deliberate token contract. Their retention/removal decision remains pending a complete token-role and page-usage map.
- Reviewed the CSS radius declarations and responsive layout sections. No raw `border-radius` value was found in the source scan; all component radii use the named shape tokens. Literal pixel values remain for optical/control dimensions, borders, breakpoints, and content constraints and must be assessed by component rather than blanket-replaced.

### F-ASSET-01 — Low — unused local Google Sans Flex subset
- Location: `assets/GoogleSansFlex-subset.woff2` (32,388 bytes); `LICENSES/OFL-GoogleSansFlex.txt`.
- Evidence: the repository tree contains the local font file, but the current four HTML pages load Roboto Flex from Google Fonts and neither `tokens.css` nor `styles.css` declares an `@font-face` or references the local WOFF2. The local font is not referenced by the current page sources or JavaScript.
- Classification: redundant/unnecessary asset in the current implementation; low severity. The OFL notice is present, so this is not a claim of missing font-license text.
- Recommendation: decide whether Google Sans Flex is an intended future typeface. If not, remove the unused WOFF2 and its now-unneeded license file in a separate cleanup; if yes, wire it deliberately and verify subset glyph coverage, fallback, and layout shift before changing the active typeface.
- Validation: repository-wide reference scan plus source inspection of all four page font links and both stylesheets. No rendered font-loading or layout-shift test was performed.

### Documentation consistency corroboration — F-TOKENS-02
- `DESIGN_SYSTEM.md` currently repeats the 10% focus and pressed opacity values, while the generated Material Web v0.192 state tokens used in the audit specify 12% for both.
- This is not a separate component defect: it is a documentation consequence of F-TOKENS-02. Update the design-system statement and `tests/motion.test.cjs` together with the eventual token correction.
- No source or test changes were made.

### Documentation and metadata review
- `README.md`, `AGENT.md`, and `DESIGN_SYSTEM.md` were reviewed against the current repository tree and page architecture.
- No confirmed broken project link or false project-status claim was found in this pass. The historical CI/deployment statement in `AGENT.md` is explicitly dated by its PR #3 commit/run context and instructs readers to check current workflows.
- `.nojekyll` is present as an empty root file. Its necessity with the current GitHub Pages Actions artifact/deploy workflow remains a deployment-specific question; no deletion is recommended without verifying the published artifact behavior.

### Scope and limitations
Source-only repository inspection. No browser rendering, font network request, screen-reader, zoom/reflow, forced-colors session, Python validator execution, or new local test run was performed. The current PR CI result remains a separate GitHub Actions observation, not a substitute for those checks.

## Live evidence update — 2026-10-30: component shape and outline applicability (source-only)

### Shape assignment review
- [x] Enumerate component `border-radius` declarations in `styles.css`.
- [x] Confirm every declared component radius uses a named `--md-sys-shape-corner-*` token; no raw radius literal was found.
- [x] Map current source usage: buttons/navigation/version chips/loading ring use the full corner; brand mark uses medium; cards, notices, release panels, asset groups and release notes use medium; code panels use small; pressed button/navigation shape changes use the increased-large token; icon-only pressed buttons use medium.
- [ ] Verify the rendered shape and component metrics against Material Web in both themes and all relevant viewport/state combinations.

**Assessment:** no additional raw-radius or inconsistent-token defect was found in source. This does not close the shape audit: token names alone do not prove the rendered component matches its M3 Web counterpart, and the known 40px-vs-48px visible button metric finding remains open.

### Outline-variant applicability classification
- [x] Enumerate source uses of `--md-sys-color-outline-variant` in `styles.css`.
- [x] Classify the observed uses: section and footer separators; docs navigation divider; borders around non-interactive project/release/notice/asset/content panels; and asset-row/group separators.
- [x] Confirm the actual interactive outlined buttons use `--md-sys-color-outline`, not outline-variant; the docs-detail accent uses outline as well.

**Assessment:** the previously measured outline-variant ratios below 3:1 do not currently identify a WCAG 1.4.11 non-text-contrast failure from the source semantics inspected: the observed outline-variant borders are grouping/separator decoration rather than the only visual cue identifying an interactive control or its state. Keep this as a documented classification, not a contrast pass for all rendered components. Revisit if browser inspection shows any boundary is necessary to identify a control, state, or meaningful graphical object.

### Scope and limitations
This classification is source-based. No rendered-state, browser-computed-style, or assistive-technology test was performed. Existing F-TOKENS-01 and F-TOKENS-02 remain unresolved; no application source or tests were changed.

## Live evidence update — 2026-10-30: standalone validator false-positive

### F-VALIDATOR-01 — Low — `validate_full.py` incorrectly requires different stylesheet assets to share one cache key
- Location: `validate_full.py:166–170`.
- Evidence: the validator extracts the version strings from both `tokens.css?v=...` and `styles.css?v=...`, then requires `len(set(found)) == 1` for each page and also requires one global version across all extracted stylesheet references.
- At the time of this finding, the page markup intentionally used distinct asset versions: `tokens.css?v=20261029-layout2` and `styles.css?v=20261029-mobile-nav4`. The cache key must be consistent for the same asset across pages; the token stylesheet and component stylesheet do not need to share a version string.
- The Pages workflow's inline validator correctly tracks versions in separate per-asset buckets (`tokens.css` and `styles.css`) and checks consistency for each asset independently.
- Classification: incorrect validator assumption; low severity while this script is not in CI, but it would create a false failure if adopted as the canonical validator unchanged.
- Recommendation: parse asset name and version together; require exactly one occurrence of each stylesheet per page, one consistent version for each asset across all pages, and allow the two different assets to have different versions. Add fixtures for both a valid split-version case and an actual cross-page mismatch.
- Validation: source-level comparison of `validate_full.py`, all four current HTML references, and the Pages inline validator. The standalone script was not executed in this pass.

### F-CI-01 refinement
Do not select `validate_full.py` as the canonical validator until F-VALIDATOR-01 is fixed and its coverage is compared with the Pages inline checks. The existing recommendation to consolidate validation remains valid, but the candidate script currently has a false-positive condition and does not yet demonstrate parity with the deployment validator.

## Resolution update — 2026-10-30: fixes implemented and verified

### Outcome
Every source-confirmed finding in this audit is resolved in the branch. Browser verification also found and fixed two additional regressions: outlined buttons with icons rendered at 42px instead of the 40px Material Web container, and the visible brand mark caused a Lighthouse `label-content-name-mismatch` failure. The site now uses one canonical static validator in CI and Pages.

### Finding status

| ID | Status | Resolution | Regression coverage |
|---|---|---|---|
| F-TOKENS-01 | Resolved | Button containers are 40px (`.btn`, `.btn--icon`). A transparent `.btn::after` keeps a 48×48px minimum hit area. Text-button icons use the 18px Material button icon size. | `tests/motion.test.cjs`; browser-computed metrics |
| F-TOKENS-02 | Resolved | Focus and pressed state layers changed from 10% to 12%; hover remains 8%. `DESIGN_SYSTEM.md` and tests updated. | `tests/motion.test.cjs` |
| F-STYLES-01 | Resolved | Documentation supporting text uses Body Medium line-height; documentation list items use Body Large line-height instead of `1.65`. | `tests/layout.test.cjs` |
| F-STYLES-02 | Resolved | `.asset-row__name` now uses the complete Title Small role, including its tracking token. | `tests/layout.test.cjs` |
| F-A11Y-01 | Resolved | Persistent `role="status"` regions exist in the release list and detail views. `releases.js` announces loading, loaded counts, empty, error, missing release, and available platform groups. The visible status text is clipped, not removed. | `tests/releases.test.cjs`, `tests/layout.test.cjs` |
| F-A11Y-02 | Resolved | The decorative brand mark is empty markup with the `A` supplied by CSS, so the visible name and accessible name agree. | `tests/layout.test.cjs`; Lighthouse |
| F-RELEASE-01 | Resolved | Release pagination now shares one `AbortController` with a 12-second total deadline; every page request receives the signal and the timer is cleared in `finally`. Retry starts a fresh request. | `tests/releases.test.cjs` timeout/retry test |
| F-ASSET-01 | Resolved | Removed the unused local Google Sans Flex WOFF2 and its now-unneeded OFL notice after confirming no page, stylesheet, or script referenced them. The reference-code MIT notice is retained because the implementation derives from that design language. | Repository reference scan |
| F-VALIDATOR-01 | Resolved | Cache keys are parsed as `(asset, version)` pairs. Each page must reference each stylesheet exactly once; versions must match per asset across pages; `tokens.css` and `styles.css` may differ. | `tests/validator.test.cjs` split-version and mismatch fixtures |
| F-CI-01 | Resolved | `validate_full.py` is the single validator. Both `.github/workflows/ci.yml` and `.github/workflows/pages.yml` run it before the Node suite. The duplicate root `validate.py` was removed. | Validator fixtures; workflow source inspection |

### Executed verification

| Check | Scope | Result |
|---|---|---|
| Static validator | `py -3 validate_full.py` | Pass: 4 HTML pages, 2 CSS files |
| Behavior suite | `node --test tests/*.test.cjs` | Pass: 43 tests, 0 failures |
| Pull-request CI | `.github/workflows/ci.yml` | Pass: canonical validator and 43 tests on the pushed head |
| Browser matrix | `index.html`, `docs.html`, `releases.html`, `release.html` × dark/light × 320, 768, 1024, 1440px | No horizontal page overflow; navigation switches at 840px; no console errors; Roboto Flex loaded on every page |
| Button metrics | Computed styles in the rendered pages | 40px containers, 48×48px generated touch targets, 18px text-button icons; all measured label states ≥4.5:1 except the M3 disabled treatment |
| Interaction states | Forced `:hover`, `:focus-visible`, `:active`, and combinations in dark and light | Distinct layers at 8%/12%/12%, 3px secondary focus ring, 8px pressed button radius; no transforms |
| Lighthouse | All four pages | Accessibility 100, Best Practices 100, SEO 100; zero failures |
| Keyboard | Tab order and Enter on the theme control | Skip link, brand, and theme toggle are reachable; Enter changed the theme and updated the control label |
| Live release state | Real GitHub API request on `releases.html` | Empty state resolved with `aria-busy="false"` and status text `No published releases are available.` |
| GitHub Pages deploy | Post-merge `Deploy website to GitHub Pages` workflow | Success; the live stylesheet serves the 3px secondary focus ring, 8px pressed radius, and primary outlined/icon role changes |

### Foundation status

| Foundation | Status | Evidence |
|---|---|---|
| Color and contrast | Compliant for measured roles | Text, variant text, primary, and secondary focus-ring ratios pass AA on all five content surfaces; outline-variant remains classified as grouping decoration |
| Typography | Compliant | All documentation and asset-filename roles use complete M3 type tokens |
| Shape | Compliant | Component radii use named shape tokens; pressed buttons contract to the 8px small corner and navigation to 20px |
| Surfaces and elevation | Compliant | Tonal surfaces, no gradients, shadows, filters, or backdrop blur |
| Motion | Compliant | 8%/12%/12% states, standard easing, 150ms feedback, pressed shape change, reduced-motion handling |
| Layout | Compliant for tested widths | Responsive 320–1440px matrix with no page overflow |
| Components | Compliant for the site’s scope | Buttons, navigation, cards, loading, feedback, links, and docs navigation checked; no unused component categories added |
| Accessibility | Automated checks pass; manual AT pending | Lighthouse 100 and live-region behavior verified; screen-reader, forced-colors, and zoom sessions remain |
| Code and token hygiene | Compliant | No undeclared CSS properties, raw component radii, or unused font assets; one validator; stale duplicate validator removed |

### Computed interaction-state alignment — 2026-10-30

A Chrome DevTools Protocol probe forced `:hover`, `:focus-visible`, and `:active` separately and in combination on every static variant, then read computed background, label, border, radius, outline, and contrast. Results led to the following corrections:

- Outlined and text buttons now use the primary role for label and state layer; standard icon buttons use on-surface-variant.
- The focus indicator is now the Material Web 3px secondary ring at a 2px offset; outlined buttons also switch their border to primary on focus.
- A press now contracts filled, tonal, outlined, and icon buttons to the 8px small corner, a visible Expressive-style change instead of the previous 20px radius that had no effect on a 40px pill. Navigation items keep the 20px large-increased press radius.

| Variant | Dark contrast: base / hover / focus / press | Light contrast: base / hover / focus / press | Pressed radius |
|---|---|---|---|
| Filled | 7.73 / 6.80 / 6.37 / 6.37 | 17.22 / 13.73 / 12.02 / 12.02 | 8px |
| Tonal | 7.29 / 5.99 / 5.43 / 5.43 | 13.24 / 11.36 / 10.48 / 10.48 | 8px |
| Outlined | 11.05 / 9.60 / 8.78 / 8.78 | 15.80 / 13.49 / 12.42 / 12.42 | 8px |
| Icon | 11.05 / 9.60 / 8.78 / 8.78 | 8.52 / 7.52 / 7.05 / 7.05 | 8px |
| Navigation | 11.05 / 13.17 / 11.76 / 11.76 | 8.52 / 13.49 / 12.42 / 12.42 | 20px |

- Every measured label pair passes 4.5:1. Disabled labels measure 3.01:1 (filled, dark), 3.17:1 (outlined, dark), 2.25:1 (filled, light), and 2.34:1 (outlined, light); this is the M3 38% disabled treatment and is exempt under WCAG 1.4.3.
- Focus rings render at 3px / 2px offset on every control. Disabled native buttons receive no focus in real use; forced pseudo-state probing cannot make them focusable.
- Focus+hover resolves to the focus layer; focus+press keeps the ring and the pressed layer. No state applies a transform or shadow.

### Remaining limitations
- No NVDA/JAWS/VoiceOver session was run. The live-region markup and state updates are verified structurally and by the JavaScript tests, not by a screen reader.
- No forced-colors or 200%/400% zoom session was run. The forced-colors CSS and responsive reflow were inspected and exercised at narrow widths only.
- The browser width matrix used same-origin iframes because the available browser tooling has no viewport emulation. Media queries resolved against each iframe viewport and no page overflowed.
- A real GitHub timeout was not induced in the browser; the 12-second deadline and retry path are covered by a fake-timer unit test.
- GitHub Pages deployment was verified after merge: the deploy workflow succeeded and the live stylesheet serves the corrected states. Lighthouse in this environment covers accessibility, best practices, and SEO, not a performance score.

### Acceptance criteria check
- [x] Every page and interactive component has been inventoried.
- [x] Each M3 foundation has an explicit status in the table above.
- [x] Every reported issue has a location, reference, impact, recommendation, and validation method.
- [x] Redundant and unnecessary assets, files, and validator duplication are listed separately from missing functionality.
- [x] The `#111111` / `#eaeaea` palette exception remains the only brand-specific exception.
- [x] The backlog is prioritized and contains no speculative or duplicate findings.
- [ ] Screen-reader, forced-colors, and zoom verification remain open.
