# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm start          # Start local dev server at http://localhost:3000
npm run build      # Build static site into build/
npm run serve      # Serve the built site locally
npm run typecheck  # Run TypeScript type checking
npm run clear      # Clear Docusaurus cache
```

## Architecture

This is a [Docusaurus 3.x](https://docusaurus.io/) documentation site for the OASWrap Go libraries (`spec`, `spec-ui`, and `gswag`).

**Key config files:**
- `docusaurus.config.ts` — site metadata, navbar, footer, syntax highlighting (Go, bash, yaml, json)
- `sidebars.ts` — defines the doc sidebar structure and ordering

**Content lives in `docs/`**, organized into two sections mirroring the Go libraries:
- `docs/spec/` — OpenAPI spec builder docs, with an `adapters/` subcategory (chi, echo, gin, fiber, net/http, gorilla/mux)
- `docs/spec-ui/` — UI handler docs, with a `providers/` subcategory (swagger-ui, stoplight, redoc, scalar, rapidoc)
- `docs/gswag/` — gswag testing DSL docs
- `docs/intro.md` — ecosystem overview landing page

**Custom React components** are in `src/components/` and the landing page is in `src/pages/`. Global CSS is in `src/css/custom.css`.

**Deployment** is automated via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`, deploying to GitHub Pages. `onBrokenLinks` is set to `'throw'`, so broken doc links will fail the build.

When adding new doc pages, register them in `sidebars.ts` to make them appear in navigation.
