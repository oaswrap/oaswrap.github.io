---
sidebar_position: 3
---

# Quick Start

## Minimal Setup

```go
package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/stoplight"
)

func main() {
	r := chi.NewRouter()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithDocsPath("/docs"),
		specui.WithSpecPath("/docs/openapi.yaml"),
		specui.WithSpecFile("openapi.yaml"),
		stoplight.WithUI(),
	)

	r.Get(handler.DocsPath(), handler.DocsFunc())
	r.Get(handler.SpecPath(), handler.SpecFunc())

	log.Println("Docs available at http://localhost:3000/docs")
	http.ListenAndServe(":3000", r)
}
```

## Handler Methods

The handler provides methods for flexible integration:

| Method | Description |
|--------|-------------|
| `handler.Docs()` | `http.Handler` for the documentation UI |
| `handler.DocsFunc()` | `http.HandlerFunc` for the documentation UI |
| `handler.DocsPath()` | Documentation path (e.g., `/docs`) |
| `handler.Spec()` | `http.Handler` for the OpenAPI spec file |
| `handler.SpecFunc()` | `http.HandlerFunc` for the OpenAPI spec file |
| `handler.SpecPath()` | Spec path (e.g., `/docs/openapi.yaml`) |
| `handler.Assets()` | Embedded assets handler (`nil` in CDN mode) |
| `handler.AssetsPath()` | Assets URL prefix (e.g., `/docs/_assets`) |
| `handler.AssetsEnabled()` | `true` when using an embedded (`*emb`) package |

## Switching UI Providers

Change the UI by swapping the provider import:

```go
// Swagger UI
import "github.com/oaswrap/spec-ui/swaggerui"
swaggerui.WithUI()

// Stoplight Elements
import "github.com/oaswrap/spec-ui/stoplight"
stoplight.WithUI()

// ReDoc
import "github.com/oaswrap/spec-ui/redoc"
redoc.WithUI()

// Scalar
import "github.com/oaswrap/spec-ui/scalar"
scalar.WithUI()

// RapiDoc
import "github.com/oaswrap/spec-ui/rapidoc"
rapidoc.WithUI()
```

## Spec Sources

You can load the OpenAPI spec from different sources:

```go
// From a file path (most common)
specui.WithSpecFile("openapi.yaml")

// From an embed.FS
//go:embed openapi.yaml
var specFS embed.FS
specui.WithSpecEmbedFS("openapi.yaml", specFS)

// From an fs.FS (e.g. os.DirFS)
specui.WithSpecIOFS("openapi.yaml", os.DirFS("docs"))

// From a runtime generator
specui.WithSpecGenerator(myGenerator)
```
