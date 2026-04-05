---
sidebar_position: 5
---

# Embedded Assets

By default, UI CSS and JavaScript are loaded from CDN. This keeps your binary small and requires no extra setup. For offline or air-gapped environments, use the embedded (`*emb`) packages instead.

## CDN Mode (Default)

Import a standard provider package — assets are loaded from CDN at runtime:

```go
import (
    specui "github.com/oaswrap/spec-ui"
    "github.com/oaswrap/spec-ui/swaggerui"
)

handler := specui.NewHandler(
    specui.WithSpecFile("openapi.yaml"),
    swaggerui.WithUI(),
)

r.Get(handler.DocsPath(), handler.DocsFunc())
r.Get(handler.SpecPath(), handler.SpecFunc())
// No assets route needed in CDN mode
```

## Embedded Mode

Import the `*emb` package variant — assets are bundled into the binary:

```go
import (
    specui "github.com/oaswrap/spec-ui"
    "github.com/oaswrap/spec-ui/swaggeruiemb"  // embedded variant
)

handler := specui.NewHandler(
    specui.WithSpecFile("openapi.yaml"),
    swaggeruiemb.WithUI(),  // embeds assets into binary
)

r.Get(handler.DocsPath(), handler.DocsFunc())
r.Get(handler.SpecPath(), handler.SpecFunc())

// Register the assets route when in embedded mode
if handler.AssetsEnabled() {
    r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```

`handler.AssetsEnabled()` returns `true` only when using an `*emb` package.

## Provider Package Reference

| Provider | CDN | Embedded |
|----------|-----|----------|
| Swagger UI | `github.com/oaswrap/spec-ui/swaggerui` | `github.com/oaswrap/spec-ui/swaggeruiemb` |
| Stoplight Elements | `github.com/oaswrap/spec-ui/stoplight` | `github.com/oaswrap/spec-ui/stoplightemb` |
| ReDoc | `github.com/oaswrap/spec-ui/redoc` | `github.com/oaswrap/spec-ui/redocemb` |
| Scalar | `github.com/oaswrap/spec-ui/scalar` | `github.com/oaswrap/spec-ui/scalaremb` |
| RapiDoc | `github.com/oaswrap/spec-ui/rapidoc` | `github.com/oaswrap/spec-ui/rapidocemb` |

## Customizing the Assets Path

The default assets URL prefix is `/docs/_assets`. Override it:

```go
handler := specui.NewHandler(
    specui.WithAssetsPath("/static/api-ui"),
    swaggeruiemb.WithUI(),
)
```

## Benefits of Embedded Mode

- **No CDN dependency** — works in air-gapped or restricted network environments
- **Deterministic builds** — UI version is pinned at build time
- **Single binary** — deploy without any external files

## Benefits of CDN Mode

- **Smaller binary** — UI assets are not included in the binary
- **Always up-to-date** — CDN serves the pinned version configured in the library
- **Faster builds** — no large asset files to compile
