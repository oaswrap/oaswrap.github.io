---
sidebar_position: 3
---

# Swagger UI

Swagger UI is the most widely used OpenAPI documentation interface. It provides an interactive API explorer familiar to most developers.

## Installation

```bash
go get github.com/oaswrap/spec-ui/swaggerui
```

## Usage

```go
import (
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/swaggerui"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	swaggerui.WithUI(),
)
```

## With Configuration

```go
import (
	"github.com/oaswrap/spec-ui/config"
	"github.com/oaswrap/spec-ui/swaggerui"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	swaggerui.WithUI(config.SwaggerUI{
		HideCurl:                 false,
		JsonEditor:               false,
		Layout:                   "StandaloneLayout",
		DefaultModelsExpandDepth: 1,
	}),
)
```

## Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `HideCurl` | `bool` | `false` | Hide curl code snippets |
| `JsonEditor` | `bool` | `false` | Enable visual JSON editor (experimental) |
| `Layout` | `string` | `"StandaloneLayout"` | Layout: `"StandaloneLayout"` or `"BaseLayout"` |
| `DefaultModelsExpandDepth` | `int` | `1` | Default depth for model expansion in the UI |

## Embedded Mode

Use `swaggeruiemb` for air-gapped deployments:

```go
import "github.com/oaswrap/spec-ui/swaggeruiemb"

handler := specui.NewHandler(
	specui.WithSpecFile("openapi.yaml"),
	swaggeruiemb.WithUI(),
)

if handler.AssetsEnabled() {
	r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```
