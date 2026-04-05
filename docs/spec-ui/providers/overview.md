---
sidebar_position: 1
---

# UI Providers Overview

spec-ui supports five OpenAPI documentation UI providers. Each is an independent package — import the one you want and only that provider's code is linked into your binary.

## Comparison

| Provider | Style | Try It | Search | Themes | Best For |
|----------|-------|--------|--------|--------|----------|
| [Stoplight Elements](/docs/spec-ui/providers/stoplight) | Three-column sidebar | Yes | Yes | Limited | Modern, Stripe-esque design |
| [Swagger UI](/docs/spec-ui/providers/swagger-ui) | Single-page | Yes | Yes | Light/Dark | Familiar, widely used |
| [ReDoc](/docs/spec-ui/providers/redoc) | Three-column | No | Yes | Limited | Read-only, executive summaries |
| [Scalar](/docs/spec-ui/providers/scalar) | Configurable | Yes | Yes | Many | Feature-rich, modern |
| [RapiDoc](/docs/spec-ui/providers/rapidoc) | Configurable | Yes | Yes | Many | Large schemas, tabular view |

## Choosing a Provider

- **Stoplight Elements** — Best default choice. Beautiful three-column layout, interactive "Try It" panel, great for developer portals.
- **Swagger UI** — Most familiar to API consumers. Well-known interface with extensive ecosystem support.
- **ReDoc** — Best for read-only documentation or executive-facing docs. Clean, minimal presentation.
- **Scalar** — Most feature-rich. Built-in themes, code generation, and a modern interface. Great for public APIs.
- **RapiDoc** — Best for large or complex APIs. Tabular schema representation and multiple render styles.

## Provider Packages

Each provider has two variants:

| Provider | CDN Import | Embedded Import |
|----------|-----------|-----------------|
| Stoplight Elements | `github.com/oaswrap/spec-ui/stoplight` | `github.com/oaswrap/spec-ui/stoplightemb` |
| Swagger UI | `github.com/oaswrap/spec-ui/swaggerui` | `github.com/oaswrap/spec-ui/swaggeruiemb` |
| ReDoc | `github.com/oaswrap/spec-ui/redoc` | `github.com/oaswrap/spec-ui/redocemb` |
| Scalar | `github.com/oaswrap/spec-ui/scalar` | `github.com/oaswrap/spec-ui/scalaremb` |
| RapiDoc | `github.com/oaswrap/spec-ui/rapidoc` | `github.com/oaswrap/spec-ui/rapidocemb` |

Use CDN packages for lightweight binaries. Use embedded (`*emb`) packages for [offline/air-gapped environments](/docs/spec-ui/embedded-assets).
