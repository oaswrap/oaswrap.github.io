---
sidebar_position: 4
---

# ReDoc

ReDoc renders API documentation in a clean three-column format, ideal for read-only documentation and executive-facing API summaries.

## Installation

```bash
go get github.com/oaswrap/spec-ui/redoc
```

## Usage

```go
import (
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/redoc"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	redoc.WithUI(),
)
```

## With Configuration

```go
import (
	"github.com/oaswrap/spec-ui/config"
	"github.com/oaswrap/spec-ui/redoc"
)

handler := specui.NewHandler(
	specui.WithTitle("My API"),
	specui.WithSpecFile("openapi.yaml"),
	redoc.WithUI(config.ReDoc{
		HideSearch:          false,
		HideDownloadButtons: false,
		HideSchemaTitles:    false,
	}),
)
```

## Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `HideSearch` | `bool` | `false` | Hide the search bar |
| `HideDownloadButtons` | `bool` | `false` | Hide the "Download" button for the API definition |
| `HideSchemaTitles` | `bool` | `false` | Hide schema titles in the documentation |

## Embedded Mode

Use `redocemb` for air-gapped deployments:

```go
import "github.com/oaswrap/spec-ui/redocemb"

handler := specui.NewHandler(
	specui.WithSpecFile("openapi.yaml"),
	redocemb.WithUI(),
)

if handler.AssetsEnabled() {
	r.Get(handler.AssetsPath()+"/*", handler.Assets().ServeHTTP)
}
```
