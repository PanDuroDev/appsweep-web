# AppSweep Material 3 Expressive Design System

This repository keeps AppSweep's **site layout** and its reusable **design foundation** separate:

- \`md3.css\`: Material 3-inspired system tokens and reusable CSS component recipes.
- \`styles.css\`: AppSweep-specific page layout and content presentation.
- \`index.html\` / \`docs.html\`: semantic page markup that applies those recipes.

This is a lightweight CSS implementation informed by Google's Material 3 and Material Web documentation. It is **not** the official \`@material/web\` custom-element package and does not claim full implementation parity with every component/API.

## Design rules

1. Prefer system roles (for example \`--md-sys-color-primary\`) over hard-coded colors.
2. Prefer component tokens (for example \`--md-comp-button-height\`) over one-off dimensions.
3. Use the correct \`on-*\` color for text and icons on a colored container.
4. Treat tonal container changes as the main dark-theme elevation cue; shadows are supplemental.
5. Use expressive shape morphing selectively for emphasized cards and hero moments, not every control.
6. All motion must respect \`prefers-reduced-motion\`; focus must remain visible.
7. Use Material Symbols through \`.material-symbol\`; icons are decorative when paired with an accessible text label.

## Color roles

The dark theme defines primary, secondary, tertiary and error role pairs; each has an \`on-*\` foreground and (where appropriate) a container pair. It also defines neutral surface roles from \`surface-container-lowest\` through \`surface-container-highest\`, \`on-surface\`, \`on-surface-variant\`, \`outline\`, \`outline-variant\`, \`inverse-surface\`, \`inverse-on-surface\`, \`inverse-primary\`, \`surface-tint\`, \`scrim\` and \`shadow\`.

AppSweep-specific success/warning statuses use the supplementary \`--app-color-*\` tokens rather than redefining Material's error palette.

## Typography

Available roles follow the Material type scale:

- Display: \`display-large\`, \`display-medium\`, \`display-small\`
- Headline: \`headline-large\`, \`headline-medium\`, \`headline-small\`
- Title: \`title-large\`, \`title-medium\`, \`title-small\`
- Body: \`body-large\`, \`body-medium\`, \`body-small\`
- Label: \`label-large\`, \`label-medium\`, \`label-small\`

Each role exposes size, line-height, weight and tracking tokens under \`--md-sys-typescale-*\`.

## Shapes, elevation and motion

- Shape tokens: \`--md-sys-shape-corner-none\`, \`extra-small\`, \`small\`, \`medium\`, \`large\`, \`large-increased\`, \`extra-large\`, \`extra-large-increased\`, \`full\`, plus AppSweep's \`brand\` silhouette.
- Elevation: \`--md-sys-elevation-level0\` to \`level5\`; use tonal surface colors before shadows.
- Motion: \`--md-sys-motion-duration-*\` and \`--md-sys-motion-easing-*\`.
- Expressive helpers: \`.md3-shape-morph\`, \`.md3-shape-squircle\`, \`.md3-shape-arch\`, \`.md3-shape-cut\`, and \`.md3-card--expressive\`.

## Component recipes

### Buttons
Use one of the five emphasis levels:
- \`.md3-button--elevated\`
- \`.md3-button--filled\`
- \`.md3-button--tonal\`
- \`.md3-button--outlined\`
- \`.md3-button--text\`

The site's existing \`.button-filled\`, \`.button-tonal\` and \`.button-outlined\` classes remain supported.

### Icon buttons
Use \`.md3-icon-button\` with an optional variant: \`.md3-icon-button--filled\`, \`--tonal\`, or \`--outlined\`. Add an accessible label whenever the icon is the only content.

### Cards and chips
- Cards: \`.md3-card--elevated\`, \`.md3-card--filled\`, \`.md3-card--outlined\`, optionally \`.md3-card--expressive\`.
- Chips: \`.md3-chip--assist\`, \`--filter\`, \`--input\`, \`--suggestion\`, \`--elevated\`, \`--warning\`, \`--success\`.

### Navigation and grouped controls
- Tabs: \`.md3-tabs\` and \`.md3-tab\`; set \`aria-selected="true"\` or \`.is-active\` on the selected item.
- Segmented controls: \`.md3-segmented-button-group\` containing \`.md3-segmented-button\`; expose selection using \`aria-pressed="true"\`.
- Adaptive navigation recipes: \`.md3-navigation-bar\`, \`.md3-navigation-item\` and \`.md3-navigation-rail\`.
- Lists: \`.md3-list\`, \`.md3-list-item\`, and \`.md3-divider\`.

### Forms and feedback
- Text fields: wrap controls in \`.md3-text-field\`; use \`aria-invalid="true"\` for invalid input and a \`.field-supporting\` hint.
- Choice controls: \`.md3-choice\`; switches: \`.md3-switch\` wrapping a checkbox input.
- Feedback surfaces: \`.md3-dialog\`, \`.md3-snackbar\`, \`.md3-tooltip[data-tooltip]\`, and \`.md3-progress-track\`.

These recipes are CSS primitives, not JavaScript components: interactive behavior (dialog opening, filtering, tab switching, form validation, progress updates and state management) must be implemented by the page or application that uses them.

## Icon font

The site loads **Material Symbols Rounded** as a variable font. The \`.material-symbol\` helper supports \`--md-icon-size\`, \`--md-icon-fill\`, \`--md-icon-weight\`, \`--md-icon-grade\` and \`--md-icon-optical-size\`. Use icon names from Google's Material Symbols catalogue and keep meaningful action labels in text for accessibility.

## References

- [Material 3 in Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)
- [Material Web — theming tokens](https://github.com/material-components/material-web/blob/main/docs/theming/README.md)
- [Material Web — shape tokens](https://github.com/material-components/material-web/blob/main/docs/theming/shape.md)
- [Material Web — buttons](https://github.com/material-components/material-web/blob/main/docs/components/button.md)
- [Material Web — icon buttons](https://github.com/material-components/material-web/blob/main/docs/components/icon-button.md)
- [Material Web — icons](https://github.com/material-components/material-web/blob/main/docs/components/icon.md)
- [Material Web — chips](https://github.com/material-components/material-web/blob/main/docs/components/chip.md)
