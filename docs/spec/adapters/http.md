---
sidebar_position: 6
---

# net/http

Integration with Go's standard library `net/http` package.

## Installation

```bash
go get github.com/oaswrap/spec/adapter/httpopenapi
```

## Basic Usage

```go
package main

import (
	"net/http"

	"github.com/oaswrap/spec/adapter/httpopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	mux := http.NewServeMux()

	api := httpopenapi.NewRouter(mux,
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

	api.Get("/users/{id}",
		option.Summary("Get user by ID"),
		option.Request(new(GetUserRequest)),
		option.Response(200, new(User)),
	)

	// Docs at /docs, spec at /docs/openapi.yaml
	http.ListenAndServe(":8080", mux)
}
```

## Path Parameters

The standard library uses `{param}` style (Go 1.22+), which maps directly to OpenAPI:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true"`
}

api.Get("/users/{id}",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```
