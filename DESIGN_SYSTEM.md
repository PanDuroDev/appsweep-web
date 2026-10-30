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
- Spacing uses shared 8dp-based tokens. The app shell can expand to 1920px on large monitors with responsive screen margins; reading text retains character-based line limits rather than stretching across the full viewport.
- Compact and medium widths reflow into stacked content and two-column feature layouts. Release cards keep their action links aligned at the bottom of each card, while homepage step labels use consistent spacing before titles. At 1200px+, the homepage uses a two-pane hero/latest-release layout, the documentation page (`.docs-page--with-nav`) places its section index in a sticky side rail beside the text, release cards form an adaptive grid, and release asset groups expand to four columns. The layout remains fluid below these breakpoints.
- Tonal surfaces replace custom shadows. Gradients, backdrop blur, arbitrary corner radii, and hover movement are not used.
- Scrollbars use the outline role as a thin thumb over a transparent track; the thumb stays above 3:1 against both page surfaces. Forced-colors mode restores the system scrollbar.
- Buttons use filled, tonal, outlined, and text treatments with consistent state feedback, 40px Material Web containers, and 48px minimum touch targets. Outlined and text labels use the primary role; standard icon buttons use on-surface-variant.
- Motion uses the Material 3 web fallback: the standard easing curve and 150ms state feedback. A press contracts pill-shaped buttons and icon buttons to the 8px small corner; navigation items use the 20px large-increased corner. This is a CSS approximation of Expressive shape motion, not native spring physics. The release progress indicator uses a steady 1.4s cycle.
- Filled, tonal, outlined, and quiet buttons use the same state-layer opacity tokens: 8% hover, 12% focus, and 12% pressed. Navigation uses matching tonal layers; no control shifts position, scales, or glows during interaction.
- Keyboard focus remains visible through a 3px secondary outline with a 2px offset; outlined buttons also switch their border to primary on focus. Disabled buttons reduce label and container contrast instead of relying on a browser-default appearance.
- Interactive text links transition color and underline thickness on hover and press. Static text, non-interactive cards, and imagery are not animated for decoration; this site currently contains no content images requiring image-specific motion.
- Reduced-motion preferences disable transitions and the loading rotation; no global smooth scrolling or ornamental entrance motion is added. Forced-colors mode remains supported.

## Release behavior

- The homepage checks the public GitHub Releases API. When the latest release includes an official Windows package, its primary button links to that asset directly.
- If no release exists, the button reports that no release is available. If GitHub cannot be reached, the button reports an error and the page offers a retry.
- The Releases page lists published releases. Each version links to its internal file list and its official GitHub release page.
- The per-release page groups actual assets as Windows, Linux, macOS, source code, and other files. Missing categories are explicitly marked unavailable.
- Release list, detail, and availability changes are announced through persistent polite live status regions, not by moving focus or announcing the full lists.
- Release notes and asset names are inserted as text. Download URLs are accepted only from the official AppSweep release path.

## Web implementation boundary

The supplied material-3-skill notes that Material Web is in maintenance mode and the newer M3 Expressive component set is not implemented on Web. This site therefore uses token-backed HTML/CSS rather than copying unsupported Compose-only motion or shape-morphing behavior.

References:
- https://m3.material.io/styles
- https://m3.material.io/develop/web
- https://github.com/SoufianoDev/material-3-skill/blob/master/skills/material-3/SKILL.md
