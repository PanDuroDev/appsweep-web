# AppSweep Material 3 Expressive Design System

This repository keeps AppSweep's **site layout** and its reusable **design foundation** separate:

- `md3.css`: Material 3-inspired system tokens and reusable CSS component recipes.
- `styles.css`: AppSweep-specific page layout and content presentation.
- `index.html` / `docs.html`: semantic page markup that applies those recipes.

This is a lightweight CSS implementation informed by Google's Material 3 and Material Web documentation. It is **not** the official `@material/web` custom-element package and does not claim full implementation parity with every component/API.

## Design rules

1. Prefer system roles (for example `--md-sys-color-primary`) over hard-coded colors.
2. Prefer component tokens (for example `--app-component-button-height`) over one-off dimensions.
3. Use the correct `on-*` color for text and icons on a colored container.
4. Treat tonal container changes as the main dark-theme elevation cue; shadows are supplemental.
5. Use expressive shape morphing selectively for emphasized cards and hero moments, not every control.
6. All motion must respect `prefers-reduced-motion`; focus must remain visible.
7. Use Material Symbols through `.material-symbol`; icons are decorative when paired with an accessible text label.

## Color roles

The default theme is a fixed brand-authored dark palette, with an optional static light palette activated by setting `data-theme="light"` on the root `<html>` element. Wallpaper-based dynamic color extraction is not implemented. Both themes define primary, secondary, tertiary and error role pairs; each has an `on-*` foreground and (where appropriate) a container pair. It also defines neutral surface roles from `surface-container-lowest` through `surface-container-highest`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`, `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `surface-tint`, `scrim` and `shadow`.

AppSweep-specific success/warning statuses use the supplementary `--app-color-*` tokens rather than redefining Material's error palette.

## Typography

Use `.app-type-display-large`, `.app-type-headline-medium`, `.app-type-body-large`, and the matching class for any of the 15 baseline roles. Responsive bold site headings use `.app-type-emphasized-*`, separate from the baseline system-token values. Available roles follow the Material type scale:

- Display: `display-large`, `display-medium`, `display-small`
- Headline: `headline-large`, `headline-medium`, `headline-small`
- Title: `title-large`, `title-medium`, `title-small`
- Body: `body-large`, `body-medium`, `body-small`
- Label: `label-large`, `label-medium`, `label-small`

Material Web exposes font, size, line-height and weight for each of its 15 baseline type roles. This project now keeps the official baseline values separate from bold, responsive AppSweep Expressive presets. Letter tracking is a site-specific extension under `--app-type-tracking-*`. Material 3 Expressive also defines emphasized counterparts; this stylesheet provides AppSweep-owned `--app-type-emphasized-*` aliases because those are not official Material Web tokens. Component properties also follow Material Web's component-token naming pattern, including `--md-filled-button-*`, `--md-outlined-button-*`, `--md-icon-button-*`, `--app-card-*`, `--md-fab-*` and `--md-outlined-text-field-*`; change these at `:root` or scope them to a component wrapper.

## Shapes, elevation and motion

- Material Web shape tokens are `--md-sys-shape-corner-none`, `extra-small`, `small`, `medium`, `large`, `extra-large` and `full`. Expressive increased radii and the brand silhouette are app-specific `--app-shape-*` extensions.
- Elevation: `--app-elevation-level0` to `level5`; use tonal surface colors before shadows.
- Motion: `--app-motion-duration-*` and `--app-motion-easing-*`.
- Expressive helpers: `.app-shape-morph`, `.app-shape-squircle`, `.app-shape-arch`, `.md3-shape-cut`, and `.app-card--expressive`.

## Component recipes

### Buttons
Use one of the five emphasis levels:
- `.md3-button--elevated`
- `.md3-button--filled`
- `.md3-button--tonal`
- `.md3-button--outlined`
- `.md3-button--text`

The site's existing `.button-filled`, `.button-tonal` and `.button-outlined` classes remain supported.

### Icon buttons
Use `.md3-icon-button` with an optional variant: `.md3-icon-button--filled`, `--tonal`, or `--outlined`. Add an accessible label whenever the icon is the only content.

Wrap a 32px visual chip or 40px icon button in `.md3-chip-hit-target` or `.md3-icon-button-hit-target` when it is interactive; each wrapper reserves a minimum 48px target without enlarging the visual component.

### Cards and chips
- Cards: `.md3-card--elevated`, `.md3-card--filled`, `.md3-card--outlined`, optionally `.app-card--expressive`.
- Chips: `.md3-chip--assist`, `--filter`, `--input`, `--suggestion`, `--elevated`, `--warning`, `--success`.

### Navigation and grouped controls
- Tabs: `.md3-tabs` and `.md3-tab`; set `aria-selected="true"` or `.is-active` on the selected item.
- Segmented controls: `.md3-segmented-button-group` containing `.md3-segmented-button`; expose selection using `aria-pressed="true"`.
- Adaptive navigation recipes: `.md3-navigation-bar`, `.md3-navigation-item` and `.md3-navigation-rail`.
- Lists: `.md3-list`, `.md3-list-item`, and `.md3-divider`.

### Forms and feedback
- Text fields: wrap controls in `.md3-text-field`; use `aria-invalid="true"` for invalid input and a `.field-supporting` hint.
- Choice controls: `.md3-choice`; switches: `.md3-switch` wrapping a checkbox input.
- Feedback surfaces: `.md3-dialog`, `.md3-snackbar`, `.md3-tooltip[data-tooltip]`, and `.md3-progress-track`.

These recipes are CSS primitives, not JavaScript components: interactive behavior (dialog opening, filtering, tab switching, form validation, progress updates and state management) must be implemented by the page or application that uses them. Native `disabled` controls are disabled by the browser; `aria-disabled="true"` only exposes a state and still requires the application to block the action. The CSS preserves pointer targeting so keyboard and assistive-technology behavior is not silently replaced by `pointer-events`.

## Icon font

The site loads **Material Symbols Rounded** as a variable font. The `.material-symbol` helper supports AppSweep-owned `--app-icon-size`, `--app-icon-fill`, `--app-icon-weight`, `--app-icon-grade` and `--app-icon-optical-size` properties that map to the font's `FILL`, `wght`, `GRAD` and `opsz` axes. Use icon names from Google's Material Symbols catalogue and keep meaningful action labels in text for accessibility.

## References

- [Material 3 in Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Material Web — theming tokens](https://github.com/material-components/material-web/blob/main/docs/theming/README.md)
- [Material Web — shape tokens](https://github.com/material-components/material-web/blob/main/docs/theming/shape.md)
- [Material Web — buttons](https://github.com/material-components/material-web/blob/main/docs/components/button.md)
- [Material Web — icon buttons](https://github.com/material-components/material-web/blob/main/docs/components/icon-button.md)
- [Material Web — icons](https://github.com/material-components/material-web/blob/main/docs/components/icon.md)
- [Material Web — chips](https://github.com/material-components/material-web/blob/main/docs/components/chip.md)


## Copy-ready HTML templates

Use these patterns as starting points. Keep interactive state, navigation, form validation and dialog behavior in JavaScript; the CSS provides appearance, not that behavior.

### Filled button with a leading icon

```html
<a class="md3-button md3-button--filled md3-button--icon-leading" href="/releases">
  <span class="material-symbol" aria-hidden="true">download</span>
  View downloads
</a>
```

### Icon button

```html
<button class="md3-icon-button md3-icon-button--tonal"
        type="button" aria-label="Search">
  <span class="material-symbol" aria-hidden="true">search</span>
</button>
```

### Expressive outlined card

```html
<article class="md3-card md3-card--outlined app-card--expressive">
  <span class="material-symbol" aria-hidden="true">apps</span>
  <h2>Installed applications</h2>
  <p>Inspect available information before taking action.</p>
</article>
```

### Filter chip with state

```html
<button class="md3-chip md3-chip--filter"
        type="button" aria-pressed="false">
  <span class="material-symbol" aria-hidden="true">filter_list</span>
  Windows apps
</button>
```

### Text field with supporting text

```html
<label class="md3-text-field">
  Publisher
  <input type="text" name="publisher" autocomplete="organization"
         aria-describedby="publisher-help">
  <span class="field-supporting" id="publisher-help">
    Filter by the publisher name.
  </span>
</label>
```

### Tabs with an accessible selected state

```html
<div class="md3-tabs" role="tablist" aria-label="Application details">
  <button class="md3-tab" role="tab"
          aria-selected="true" id="tab-overview">Overview</button>
  <button class="md3-tab" role="tab"
          aria-selected="false" id="tab-locations">Locations</button>
</div>
```

### Switch

```html
<label class="md3-switch">
  <input type="checkbox" name="show-system-apps">
  <span>Show system apps</span>
</label>
```

Set the selected tab/chip attributes to match the real application state. Do not use CSS-selected appearances as a substitute for keyboard behavior or accessible state.
