# AppSweep · Material 3 Expressive

## Reference, not a generic dashboard

This site adapts [metawka/expressive-profile](https://github.com/metawka/expressive-profile) at commit `0dacdd6b4cd8d649b71ace733afbfe1b92649955`. Its SVG profile blocks are recreated as semantic HTML: an avatar/monogram header, status chips, project facts, softly inset feature cards, consistent sections, and releases/documentation. AppSweep content replaces personal-profile content. There is no profile generator, fake contribution calendar, invented statistics, or application mockup.

Reference geometry: 840px content width; 16px section rhythm; 300px desktop profile header; 224px avatar silhouette; 32px outer corners; 28px project-card corners; 24px fact-tile corners; 28px section padding; 24px project padding; 44px controls and 48px social pills. Two feature cards per row, with an odd last card centered. Mobile cards stack instead of scaling text down.

## Color, typography, and elevation

`tokens.css` contains light/dark Material color roles generated once with `@material/material-color-utilities` 0.4.0: `SchemeTonalSpot(Hct.fromInt(argbFromHex('#FF5CA8')), dark, 0)`, the reference default. No runtime color library is needed. Primary is `#8a4a64` in light mode and `#ffb0cd` in dark mode; backgrounds are `#fff8f8` / `#191114`. Warm tertiary containers provide restrained amber accents.

Google Sans Flex uses the reference's local WOFF2 subset, weights 400–800 and `ROND` 100. Large profile titles, 24px section headings, 23px feature titles, and readable 15–19px copy preserve its hierarchy. Material Symbols Rounded use filled glyphs and are always hidden from assistive technology when decorative.

Surface containers distinguish layers. The app bar mixes surface at 82% with transparency and blur(18px). Cards use the reference's tinted shadow: `0 1px 2px rgb(0 0 0 / .04), 0 18px 48px -24px` with primary at 30%. No neon outlines or flat dashboard panels.

## Motion and behavior

`app.js` reproduces the reference's 180-sample cookie, flower, sunny, clover, gem, and soft silhouettes. The release loader morphs through its seven-shape sequence with a bouncy spring and rotation. It runs only during the real 12-second-bounded GitHub lookup; hidden pages and reduced-motion preferences stop it. CSS supplies subtle floating-background rotation and progressive scroll entrances.

The reading indicator has a wavy active segment, a separated straight remaining track, and a terminal dot. Release lookup uses an indeterminate wavy bar, not a fabricated percentage. These are custom Expressive SVGs, not standard Material Web progress components. Material Web's CDN bundle is intentionally not required by this HTML/CSS implementation.

Theme selection is persisted explicitly in either direction; otherwise it follows the system. Download URLs must use HTTPS and the official AppSweep GitHub release-asset path. API text uses `textContent`. Empty, ready, error, retry, and timeout states are distinct.

## Accessibility and limits

Native links/buttons, semantic headings and lists, a skip link, visible keyboard focus, readable color-role pairs, live release status, reduced motion, and forced-colors borders. The sticky-header anchor offset follows its actual height. Documentation links mark the current section. With JavaScript disabled, the real content and official releases link remain available; decorative shapes fall back to rounded silhouettes.

`shortcut:` External Material Symbols require Google Fonts; self-host a glyph subset when full offline rendering is required. The local main-font subset covers this English site; use the full font if additional writing systems are introduced. Loader silhouettes deliberately match the reference implementation, not pixel-identical AndroidX polygon geometry.

## Sources and licenses

- [Reference](https://github.com/metawka/expressive-profile): layout, silhouettes, and font subset; MIT notice in `LICENSES/expressive-profile-MIT.txt`.
- Google Sans Flex: `LICENSES/OFL-GoogleSansFlex.txt` (SIL Open Font License).
- [Material 3 web guidance](https://m3.material.io/develop/web), [official Material Web](https://github.com/material-components/material-web), and [Material Color Utilities](https://github.com/material-foundation/material-color-utilities).
