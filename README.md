# AppSweep website

A responsive site for the pre-alpha Windows project. It explains the project, links to documentation and source, and checks official GitHub Releases for a downloadable build.

## Design

The site uses semantic HTML, CSS, and a small JavaScript file. The default visual system is monochrome: **#111111** near-black foundations, **#eaeaea** primary text, a progression of charcoal surfaces, and subtle silver gradients. An optional light theme remains available through the theme control. The layout prioritizes one headline, three concise feature explanations, one release panel, and focused documentation.

## Run locally

    python -m http.server 8123 --bind 127.0.0.1

On Windows, use py -3 -m http.server 8123 --bind 127.0.0.1 if python is unavailable. Then open http://127.0.0.1:8123/.

## Checks

Run the dependency-free behavior tests with Node.js 22 or newer:

    node --test tests/app.test.cjs

The Pages workflow validates HTML, local links, CSS tokens, documented component classes, and cache versions. Pushes to main deploy the site to https://pandurodev.github.io/appsweep-web/.

AppSweep is experimental. Check official release notes, verify paths, and back up important data before testing.
