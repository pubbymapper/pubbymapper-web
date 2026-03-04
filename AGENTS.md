# AGENTS.md

## Cursor Cloud specific instructions

React + Vite single-page application. Uses **pnpm** as the package manager.

### Common commands

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (port 5173) |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Preview build | `pnpm preview` |

### Project structure

- `src/main.jsx` — React entry point
- `src/App.jsx` — root component
- `src/pages/Home.jsx` — home page rendered at `/`
- `src/pages/Home.css` — home page styles
- `src/index.css` — global styles

### Notes

- `esbuild` is allowed to run its postinstall script via `pnpm.onlyBuiltDependencies` in `package.json`. If a new native dependency is added, it may need to be added there too.
- No test framework is configured yet.
