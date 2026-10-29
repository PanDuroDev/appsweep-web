# AppSweep website design

The website uses Material Design 3 roles and component patterns through semantic HTML and CSS tokens. It does not add custom decorative treatments or claim full Material 3 Expressive parity on the web.

## Color

- The dark theme is the default. Its page surface is `#111111`, with primary text `#eaeaea`.
- Monochrome values are assigned to Material 3 semantic roles in `tokens.css`; CSS components consume those roles instead of defining their own colors.
- Primary/on-primary, secondary-container/on-secondary-container, and surface/on-surface are applied as semantic pairs.
- The light theme uses matching neutral roles and remains available through the existing theme control.
- Error messages use the Material 3 error role. Surface containers and outline-variant communicate hierarchy and boundaries without gradients or shadows.

## Typography, shape, layout, and state

- The type scale uses Roboto Flex and Material 3 display, headline, title, body, and label roles.
- Buttons use the full corner token; cards and grouped panels use the medium corner token; code panels use the small corner token.
- Spacing uses shared 8dp-based tokens. Main content remains constrained to 920px and reflows at compact/medium breakpoints.
- Tonal surfaces replace custom shadows. Gradients, backdrop blur, arbitrary corner radii, and hover movement are not used.
- Buttons use filled, tonal, and outlined treatments with consistent state feedback and 48px minimum interaction targets.
- Reduced-motion and forced-colors modes remain supported. Release loading uses a simple progress indicator rather than custom shape morphing.

## Release behavior

- The homepage checks the public GitHub Releases API. When the latest release includes an official Windows package, its primary button links to that asset directly.
- If no release exists, the button reports that no release is available. If GitHub cannot be reached, the button reports an error and the page offers a retry.
- The Releases page lists published releases. Each version links to its internal file list and its official GitHub release page.
- The per-release page groups actual assets as Windows, Linux, macOS, source code, and other files. Missing categories are explicitly marked unavailable.
- Release notes and asset names are inserted as text. Download URLs are accepted only from the official AppSweep release path.

## Web implementation boundary

The supplied material-3-skill notes that Material Web is in maintenance mode and the newer M3 Expressive component set is not implemented on Web. This site therefore uses token-backed HTML/CSS rather than copying unsupported Compose-only motion or shape-morphing behavior.

References:
- https://m3.material.io/styles
- https://m3.material.io/develop/web
- https://github.com/SoufianoDev/material-3-skill/blob/master/skills/material-3/SKILL.md
