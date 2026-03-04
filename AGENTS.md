# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML landing page (`index.html`) with no build system, no package manager, and no dependencies.

### Running the app

Serve `index.html` with any static file server. The simplest option:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in the browser.

### Lint / Test / Build

- **No linter, test framework, or build step** is configured. The project is a single HTML file with inline CSS and no JavaScript.
- To validate HTML, you can use an online validator or `npx html-validate index.html` (ad-hoc, not pre-installed).
