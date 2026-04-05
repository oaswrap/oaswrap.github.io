---
sidebar_position: 2
---

# Chi

Integration with [go-chi/chi](https://github.com/go-chi/chi), a lightweight, idiomatic Go HTTP router.

## Installation

```bash
go get github.com/oaswrap/spec/adapter/chiopenapi
```

## Basic Usage

```go
package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/oaswrap/spec/adapter/chiopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	r := chi.NewRouter()

	api := chiopenapi.NewRouter(r,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
		option.WithServer("https://api.example.com"),
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

	api.Get("/users/{id}",
		option.Summary("Get user by ID"),
		option.Request(new(GetUserRequest)),
		option.Response(200, new(User)),
		option.Response(404, new(ErrorResponse)),
	)

	// Docs at /docs, spec at /docs/openapi.yaml
	http.ListenAndServe(":8080", r)
}
```

## With Chi Middleware

The adapter works alongside standard chi middleware:

```go
r := chi.NewRouter()
r.Use(middleware.Logger)
r.Use(middleware.Recoverer)

api := chiopenapi.NewRouter(r,
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),
)
```

## Groups

```go
v1 := api.Group("/api/v1")
v1.Get("/users", option.Summary("List users"))

protected := api.Group("/api/v1",
    option.GroupSecurity("bearerAuth"),
    option.GroupTags("Protected"),
)
protected.Get("/profile", option.Summary("Get profile"))
```

## Path Parameters

Chi uses `:param` style. The adapter automatically converts these to `{param}` for OpenAPI:

```go
api.Get("/users/{id}", ...)  // use {id} in spec — chi maps it from :id
```

Define parameters in your request struct:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true"`
}
```
