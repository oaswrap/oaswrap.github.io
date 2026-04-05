---
sidebar_position: 5
---

# Scalar

Scalar is a feature-rich modern API documentation interface with built-in themes, search, and code generation. It's an excellent choice for public-facing APIs.

## Installation

```bash
go get github.com/oaswrap/spec-ui/scalar
```

## Usage

```go
import (
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/scalar"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	scalar.WithUI(),
)
```

## With Configuration

```go
import (
	"github.com/oaswrap/spec-ui/config"
	"github.com/oaswrap/spec-ui/scalar"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	scalar.WithUI(config.Scalar{
		DarkMode:             true,
		Layout:               "modern",
		Theme:                "moon",
		DocumentDownloadType: "both",
	}),
)
```

## Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `ProxyURL` | `string` | `""` | Proxy URL for API requests |
| `HideSidebar` | `bool` | `false` | Hide sidebar navigation |
| `HideModels` | `bool` | `false` | Hide models in the sidebar |
| `DocumentDownloadType` | `string` | `"both"` | Download type: `"json"`, `"yaml"`, `"both"`, or `"none"` |
| `HideTestRequestButton` | `bool` | `false` | Hide the "Test Request" button |
| `HideDeveloperTools` | `bool` | `false` | Hide developer tools |
| `HideSearch` | `bool` | `false` | Hide the search bar |
| `DarkMode` | `bool` | `false` | Enable dark mode |
| `Layout` | `string` | `"modern"` | Layout: `"modern"` or `"classic"` |
| `Theme` | `string` | `"default"` | Theme name (see [Scalar themes](https://guides.scalar.com/scalar/scalar-api-references/themes)) |

## Embedded Mode

Use `scalaremb` for air-gapped deployments:

```go
import "github.com/oaswrap/spec-ui/scalaremb"

handler := specui.NewHandler(
	specui.WithSpecFile("openapi.yaml"),
	scalaremb.WithUI(),
)

if handler.AssetsEnabled() {
	r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```
