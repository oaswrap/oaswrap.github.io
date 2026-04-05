---
sidebar_position: 4
---

# Configuration

The main `specui` package provides core configuration options. UI provider selection and provider-specific config is done through the provider packages.

## Core Options

```go
import specui "github.com/oaswrap/spec-ui"

handler := specui.NewHandler(
    specui.WithTitle("My API"),
    specui.WithDocsPath("/docs"),
    specui.WithSpecPath("/docs/openapi.yaml"),
    specui.WithSpecFile("openapi.yaml"),
    specui.WithCacheAge(3600),
    swaggerui.WithUI(),
)
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `WithTitle(t)` | `string` | `""` | Set the documentation page title |
| `WithDocsPath(p)` | `string` | `"/docs"` | Set the URL path for the documentation UI |
| `WithSpecPath(p)` | `string` | `"/docs/openapi.json"` | Set the URL path for the OpenAPI spec endpoint |
| `WithSpecFile(f)` | `string` | `""` | Path to the OpenAPI spec file on disk |
| `WithSpecEmbedFS(f, fs)` | `string, embed.FS` | — | Spec from an embedded filesystem |
| `WithSpecIOFS(f, fs)` | `string, fs.FS` | — | Spec from a generic `fs.FS` (e.g., `os.DirFS`) |
| `WithSpecGenerator(g)` | `SpecGenerator` | — | Runtime spec generator (e.g., `spec.Generator`) |
| `WithCacheAge(age)` | `int` | `3600` | Cache-Control max-age in seconds for the spec endpoint |
| `WithAssetsPath(p)` | `string` | `"/docs/_assets"` | URL prefix for embedded assets (embedded mode only) |

## Spec Sources

Only one spec source should be provided. Priority (if multiple are set): `SpecGenerator` > `SpecEmbedFS` > `SpecIOFS` > `SpecFile`.

### File Path

```go
specui.WithSpecFile("openapi.yaml")
```

### Embedded Filesystem

```go
//go:embed openapi.yaml
var specFS embed.FS

specui.WithSpecEmbedFS("openapi.yaml", specFS)
```

### OS Filesystem

```go
specui.WithSpecIOFS("openapi.yaml", os.DirFS("docs"))
```

### Runtime Generator

Implement the `SpecGenerator` interface to generate the spec dynamically on each request:

```go
// SpecGenerator is satisfied by spec.Generator
type SpecGenerator interface {
    MarshalYAML() ([]byte, error)
}

// Use spec.Generator directly
r := spec.NewRouter(option.WithTitle("My API"))
r.Get("/users", option.Response(200, new([]User)))

handler := specui.NewHandler(
    specui.WithSpecGenerator(r),
    swaggerui.WithUI(),
)
```

The spec is generated once (cached on first request) via `sync.Once`.
