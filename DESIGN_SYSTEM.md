# AppSweep website design

## Visual direction

A compact, text-first website for AppSweep's experimental Windows utility. Its visual identity is deliberately monochrome: a near-black **#111111** foundation, **#eaeaea** primary text, and carefully spaced charcoal/silver tones for hierarchy. Subtle gradients add depth without neon accents, colorful decoration, or heavy shadows.

The homepage has one concise introduction, a direct latest-Windows-download action, a short three-step explanation, and the current-release panel. The dedicated **Releases** page displays every published GitHub release; each release opens an internal download detail page that lists Windows, Linux, macOS, source-code archives, and any remaining attached files.

## Tokens and themes

- **tokens.css** defines semantic Material-inspired color roles and app-owned palette tokens.
- Dark mode is the default: `--app-color-primary: #111111`, `--app-color-text: #eaeaea`; near-black surfaces progress through `#151515`, `#1b1b1b`, `#222222`, and `#2a2a2a`.
- The accessible light theme remains available from the theme control. The selection is saved in local storage.
- **styles.css** contains responsive page layout and component recipes. Surfaces use borders and low-contrast gradients rather than large shadows.
- Release lists and platform groups use the same semantic token colors, keyboard focus, and responsive layouts.

## Release data and downloads

- **app.js** checks the newest public release for a Windows package. If found, the home-page action links directly to its official GitHub asset URL; it does not send the user to the release webpage. If no Windows package or no release exists, the action links to the website's Releases center and explains the state.
- **releases.js** fetches the published releases from the official AppSweep repository, including pagination. It validates release-page, source-archive, and attached-asset URLs before rendering links.
- **releases.html** lists every published release and provides buttons for internal file details and the original GitHub release page.
- **release.html?tag=...** groups actual release assets into Windows, Linux, macOS, source code, and other files. Empty platform groups explicitly say that no file is available. GitHub's generated ZIP and tar.gz source archives are listed when the API supplies trusted source URLs.
- Asset names and release notes are inserted as text, never as HTML. Download links are only generated for official AppSweep release assets and source archives.
- API errors are distinct from an empty release list. Users can retry when GitHub is unreachable, and empty states do not invent downloads.

## Behavior and accessibility

- The UI supports keyboard focus, reduced motion, forced colors, responsive layouts, and skip links.
- The live release lookup shows separate loading, no-release, no-Windows-build, and network-error states.
- No user data or server-side credentials are required; public GitHub release metadata is fetched in the browser.

## Sources and licenses

- The inherited Google Sans Flex font remains covered by **LICENSES/OFL-GoogleSansFlex.txt**.
- Material 3 guidance: https://m3.material.io/develop/web
- Official Material Web reference: https://github.com/material-components/material-web
