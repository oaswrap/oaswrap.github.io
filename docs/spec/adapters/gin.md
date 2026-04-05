---
sidebar_position: 4
---

# Gin

Integration with [gin-gonic/gin](https://github.com/gin-gonic/gin), a fast HTTP web framework.

## Installation

```bash
go get github.com/oaswrap/spec/adapter/ginopenapi
```

## Basic Usage

```go
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/oaswrap/spec/adapter/ginopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	r := gin.Default()

	api := ginopenapi.NewRouter(r,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
		option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("Bearer")),
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

	api.Get("/users/:id",
		option.Summary("Get user by ID"),
		option.Request(new(GetUserRequest)),
		option.Response(200, new(User)),
	)

	// Docs at /docs, spec at /docs/openapi.yaml
	r.Run(":8080")
}
```

## Path Parameters

Gin uses `:param` style. The adapter converts these to `{param}` for OpenAPI. Use the `uri` tag for path binding:

```go
type GetUserRequest struct {
    ID string `uri:"id" required:"true" description:"User identifier"`
}

api.Get("/users/:id",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```

## Groups

```go
v1 := api.Group("/api/v1")
v1.Get("/users", option.Summary("List users"))

auth := api.Group("/api/v1",
    option.GroupSecurity("bearerAuth"),
    option.GroupTags("Protected"),
)
auth.Get("/profile", option.Summary("Get profile"))
```
