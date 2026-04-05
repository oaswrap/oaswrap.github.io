---
sidebar_position: 5
---

# Fiber

Integration with [gofiber/fiber](https://github.com/gofiber/fiber), an Express-inspired Go web framework built on Fasthttp.

## Fiber v2

### Installation

```bash
go get github.com/oaswrap/spec/adapter/fiberopenapi
```

### Usage

```go
package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/oaswrap/spec/adapter/fiberopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	app := fiber.New()

	api := fiberopenapi.NewRouter(app,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
	)

	api.Get("/users",
		option.Summary("List users"),
		option.Response(200, new([]User)),
	)

	api.Post("/users",
		option.Summary("Create user"),
		option.Request(new(CreateUserRequest)),
		option.Response(201, new(User)),
	)

	// Docs at /docs, spec at /docs/openapi.yaml
	app.Listen(":8080")
}
```

## Fiber v3

### Installation

```bash
go get github.com/oaswrap/spec/adapter/fiberv3openapi
```

### Usage

```go
package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/oaswrap/spec/adapter/fiberv3openapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	app := fiber.New()

	api := fiberv3openapi.NewRouter(app,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
	)

	api.Get("/users",
		option.Summary("List users"),
		option.Response(200, new([]User)),
	)

	app.Listen(":8080")
}
```

## Path Parameters

Fiber uses `:param` style. The adapter converts to `{param}` for OpenAPI:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true"`
}

api.Get("/users/:id",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```
