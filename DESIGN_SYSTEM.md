# AppSweep website design

## Visual direction

A compact, text-first website for AppSweep's experimental Windows utility. Its visual identity is deliberately monochrome: a near-black **#111111** foundation, **#eaeaea** primary text, and carefully spaced charcoal/silver tones for hierarchy. Subtle gradients add depth without neon accents, colorful decoration, or heavy shadows.

The page structure stays simple:
1. A compact header with project name, navigation, theme toggle, and releases entry.
2. One clear headline, a short description, and two actions.
3. A single three-step explanation of discovery, inspection, and path review.
4. One release panel that checks the official GitHub Releases API.
5. A short footer.

The homepage avoids redundant stats, repeated calls to action, and full-page decorative shapes. Documentation uses the same token and surface system.

## Tokens and themes

- **tokens.css** is the source of truth for semantic Material-inspired color roles and app-owned palette tokens.
- Dark mode is the default: `--app-color-primary: #111111`, `--app-color-text: #eaeaea`; near-black surfaces progress through `#151515`, `#1b1b1b`, `#222222`, and `#2a2a2a`.
- Text levels use `#eaeaea` for primary content and `#b8b8b8` for secondary copy. Borders use muted charcoal; silver accents and restrained gradients define titles, the monogram, and surfaces.
- The accessible light theme remains available from the theme control. The selection is saved in local storage; without a saved choice the site starts in dark mode.
- **styles.css** contains responsive page layout and component recipes. Surfaces use borders and low-contrast gradients rather than large shadows; controls share a consistent 12px radius.
- Main content is limited to 920px. The three feature cards form equal columns on desktop and stack on smaller screens.
- Components are semantic HTML/CSS; Material Web custom elements are not imported.

## Behavior and accessibility

- **app.js** keeps the theme control and live GitHub release lookup. Download assets are accepted only from HTTPS URLs in the official AppSweep release path.
- If GitHub is unavailable or no release exists, a direct official releases link remains visible.
- Keyboard focus, reduced motion, forced colors, responsive layouts, and a skip link are supported.
- Loading animation runs only during the actual release lookup; page sections do not animate into view.

## Sources and licenses

- The inherited Google Sans Flex font remains covered by **LICENSES/OFL-GoogleSansFlex.txt**.
- Material 3 guidance: https://m3.material.io/develop/web
- Official Material Web reference: https://github.com/material-components/material-web
