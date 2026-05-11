---
sidebar_position: 6
---

# Iris

Integration with [kataras/iris](https://github.com/kataras/iris), a full-featured Go web framework.

## Installation

```bash
go get github.com/oaswrap/spec/adapter/irisopenapi
```

## Basic Usage

```go
package main

import (
	"github.com/kataras/iris/v12"
	"github.com/oaswrap/spec/adapter/irisopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	app := iris.New()

	api := irisopenapi.NewRouter(app,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
	)

	api.Get("/ping", func(ctx iris.Context) {
		_ = ctx.JSON(map[string]string{"message": "pong"})
	}).With(
		option.OperationID("ping"),
		option.Response(200, new(struct {
			Message string `json:"message"`
		})),
	)

	_ = app.Listen(":8080")
}
```

## Built-in Docs Endpoints

- `/docs` for interactive docs UI
- `/docs/openapi.yaml` for raw OpenAPI YAML

Disable built-in docs routes when needed:

```go
api := irisopenapi.NewRouter(app,
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),
    option.WithDisableDocs(),
)
```
