# oaswrap.github.io

Official documentation website for the [OASWrap](https://github.com/oaswrap) Go libraries — built with [Docusaurus](https://docusaurus.io/).

## Libraries Documented

- **[spec](https://github.com/oaswrap/spec)** — Framework-agnostic OpenAPI 3.x specification builder for Go
- **[spec-ui](https://github.com/oaswrap/spec-ui)** — Multiple OpenAPI documentation UIs as Go HTTP handlers

## Requirements

- Node.js >= 20.0

## Local Development

```bash
npm install
npm start
```

Opens a local dev server at `http://localhost:3000`. Most changes are reflected live without restarting.

## Build

```bash
npm run build
```

Generates static files into the `build/` directory.

## Deployment

Deployment is automated via GitHub Actions on every push to `main`. The workflow builds the site and deploys it to GitHub Pages.

To deploy manually, ensure the GitHub Pages source is set to **GitHub Actions** in the repository settings.

## Project Structure

```
blog/                     # Blog posts (release notes, articles)
docs/
├── intro.md              # Ecosystem overview
├── spec/                 # spec library documentation
│   ├── adapters/         # Framework adapter guides
│   └── ...
└── spec-ui/              # spec-ui library documentation
    ├── providers/        # UI provider guides
    └── ...
src/
├── pages/                # Landing page
├── components/           # React components
└── css/                  # Global styles
static/
└── img/                  # Logo and favicon
.github/
└── workflows/
    └── deploy.yml        # GitHub Actions deployment
```
