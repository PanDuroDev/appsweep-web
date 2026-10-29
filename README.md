# AppSweep website

A responsive website for the pre-alpha Windows project. It explains the project, links to documentation and source, and uses official GitHub release data to power direct downloads.

## Releases and downloads

- The home-page **Download latest version** action downloads the latest published Windows package directly from its official GitHub release asset URL when one exists.
- **Releases** lists every published release and gives each version a file-details page plus a link to its GitHub release page.
- The per-release details page shows real assets grouped as Windows, Linux, macOS, source code, and other files. Missing platforms are labelled as unavailable rather than given fake links.
- If GitHub is unreachable, the site shows an error state and offers a retry. An empty release list is shown separately from a network error.
- The site is static; release metadata is fetched from the public GitHub Releases API in the browser.

## Run locally

    python -m http.server 8123 --bind 127.0.0.1

On Windows, use py -3 -m http.server 8123 --bind 127.0.0.1 if python is unavailable. Then open http://127.0.0.1:8123/.

## Checks

Run dependency-free behavior tests with Node.js 22 or newer:

    node --test tests/*.test.cjs

The Pages workflow validates HTML, local links, CSS tokens, documented component classes, and stylesheet cache versions. Pushes to main deploy the site to https://pandurodev.github.io/appsweep-web/.

AppSweep is experimental. Check official release notes, verify paths, and back up important data before testing.
