---
sidebar_position: 2
---

# Stoplight Elements

Stoplight Elements provides a beautiful three-column "Stripe-esque" layout with a sidebar, content area, and interactive "Try It" panel. It's the default UI used by the spec framework adapters.

## Installation

```bash
go get github.com/oaswrap/spec-ui/stoplight
```

## Usage

```go
import (
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/stoplight"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	stoplight.WithUI(),
)
```

## With Configuration

```go
import (
	"github.com/oaswrap/spec-ui/config"
	"github.com/oaswrap/spec-ui/stoplight"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	stoplight.WithUI(config.StoplightElements{
		HideExport:     false,
		HideSchemas:    false,
		HideTryIt:      false,
		HideTryItPanel: false,
		Layout:         "sidebar",
		Logo:           "/assets/logo.png",
		Router:         "hash",
	}),
)
```

## Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `HideExport` | `bool` | `false` | Hide the "Export" button |
| `HideSchemas` | `bool` | `false` | Hide schemas in the Table of Contents |
| `HideTryIt` | `bool` | `false` | Hide the "Try It" interactive feature |
| `HideTryItPanel` | `bool` | `false` | Hide the "Try It" panel |
| `Layout` | `string` | `"sidebar"` | Layout: `"sidebar"`, `"responsive"`, or `"stacked"` |
| `Logo` | `string` | `""` | URL to a logo image |
| `Router` | `string` | `"hash"` | Router type: `"hash"`, `"history"`, `"memory"`, or `"static"` |

## Embedded Mode

Use `stoplightemb` for air-gapped deployments:

```go
import "github.com/oaswrap/spec-ui/stoplightemb"

handler := specui.NewHandler(
	specui.WithSpecFile("openapi.yaml"),
	stoplightemb.WithUI(),
)

// Register the assets route
if handler.AssetsEnabled() {
	r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```
