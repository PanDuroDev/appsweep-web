# AppSweep website design

## Direction

A restrained, text-first website for an experimental Windows utility. It keeps the warm rose Material 3-inspired palette and local Google Sans Flex font, but avoids copying a profile/dashboard layout. The visual hierarchy is deliberately simple:

1. A compact header with project name, navigation, theme toggle, and releases entry.
2. One clear headline, a short description, and two actions.
3. A single three-step explanation of discovery, inspection, and path review.
4. One release panel that checks the official GitHub Releases API.
5. A short footer.

The homepage intentionally avoids redundant project-stat tiles, repeated calls to action, full-page decorative shapes, and scroll-triggered entrance animations. The documentation page uses the same spacing and surface rules.

## Tokens and themes

- **tokens.css** defines the light/dark Material 3-inspired color roles and local Google Sans Flex font.
- Theme choice is persisted in local storage. With no saved preference, the site follows the system theme.
- **styles.css** contains page layout and component recipes. Surfaces use subtle borders rather than large shadows; controls share a consistent 12px radius.
- Main content is limited to 920px. The three feature cards form equal columns on desktop and stack on smaller screens.
- Components are semantic HTML and CSS; the official Material Web custom elements are not imported.

## Behavior and accessibility

- **app.js** keeps the theme control and live GitHub release lookup. Download assets are accepted only from HTTPS URLs in the official AppSweep release path.
- If GitHub is unavailable or no release exists, a direct official releases link remains visible.
- The UI supports keyboard focus, reduced motion, forced colors, responsive layouts, and a skip link.
- Loading animation runs only during the actual release lookup; page sections do not animate into view.

## Sources and licenses

- The previous expressive-profile visual reference has been replaced by an AppSweep-specific simplified layout. The inherited font file remains covered by **LICENSES/OFL-GoogleSansFlex.txt**.
- Material 3 guidance: https://m3.material.io/develop/web
- Official Material Web reference: https://github.com/material-components/material-web
