---
sidebar_position: 6
---

# RapiDoc

RapiDoc is a web component-based API viewer with multiple themes, layout options, and distinctive tabular and tree-based schema representations. It's well-suited for large or complex API specifications.

## Installation

```bash
go get github.com/oaswrap/spec-ui/rapidoc
```

## Usage

```go
import (
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/rapidoc"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	rapidoc.WithUI(),
)
```

## With Configuration

```go
import (
	"github.com/oaswrap/spec-ui/config"
	"github.com/oaswrap/spec-ui/rapidoc"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	rapidoc.WithUI(config.RapiDoc{
		Theme:        "dark",
		Layout:       "row",
		RenderStyle:  "read",
		SchemaStyle:  "table",
		PrimaryColor: "#FF791A",
	}),
)
```

## Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `Theme` | `string` | `"light"` | Theme: `"light"` or `"dark"` |
| `Layout` | `string` | `"row"` | Layout: `"row"` or `"column"` |
| `RenderStyle` | `string` | `"read"` | Render style: `"read"`, `"view"`, or `"focused"` |
| `SchemaStyle` | `string` | `"table"` | Schema display: `"table"` or `"tree"` |
| `BgColor` | `string` | `"#fff"` | Background color |
| `TextColor` | `string` | `"#444"` | Text color |
| `HeaderColor` | `string` | `"#444444"` | Header color |
| `PrimaryColor` | `string` | `"#FF791A"` | Primary/accent color |
| `HideInfo` | `bool` | `false` | Hide the info section |
| `HideHeader` | `bool` | `false` | Hide the header section |
| `HideSearch` | `bool` | `false` | Hide the search bar |
| `HideAdvancedSearch` | `bool` | `false` | Hide the advanced search bar |
| `HideTryIt` | `bool` | `false` | Hide the "Try" feature |
| `Logo` | `string` | `""` | Logo URL |

## Embedded Mode

Use `rapidocemb` for air-gapped deployments:

```go
import "github.com/oaswrap/spec-ui/rapidocemb"

handler := specui.NewHandler(
	specui.WithSpecFile("openapi.yaml"),
	rapidocemb.WithUI(),
)

if handler.AssetsEnabled() {
	r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```
