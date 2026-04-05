---
sidebar_position: 3
---

# Echo

Integration with [labstack/echo](https://github.com/labstack/echo). Two adapters are available for Echo v4 and Echo v5.

## Echo v4

### Installation

```bash
go get github.com/oaswrap/spec/adapter/echoopenapi
```

### Usage

```go
package main

import (
	"github.com/labstack/echo/v4"
	"github.com/oaswrap/spec/adapter/echoopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	e := echo.New()

	api := echoopenapi.NewRouter(e,
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
	e.Logger.Fatal(e.Start(":8080"))
}
```

## Echo v5

### Installation

```bash
go get github.com/oaswrap/spec/adapter/echov5openapi
```

### Usage

```go
package main

import (
	"github.com/labstack/echo/v5"
	"github.com/oaswrap/spec/adapter/echov5openapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	e := echo.New()

	api := echov5openapi.NewRouter(e,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
	)

	api.Get("/users",
		option.Summary("List users"),
		option.Response(200, new([]User)),
	)

	e.Logger.Fatal(e.Start(":8080"))
}
```

## Path Parameters

Echo uses `:param` style. The adapter converts these to `{param}` for OpenAPI:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true"`
}

api.Get("/users/:id",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```
