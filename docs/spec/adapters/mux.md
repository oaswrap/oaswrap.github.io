---
sidebar_position: 7
---

# Gorilla Mux

Integration with [gorilla/mux](https://github.com/gorilla/mux), a powerful HTTP router and URL matcher.

## Installation

```bash
go get github.com/oaswrap/spec/adapter/muxopenapi
```

## Usage

```go
package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/oaswrap/spec/adapter/muxopenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	r := mux.NewRouter()

	api := muxopenapi.NewRouter(r,
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

	http.ListenAndServe(":8080", r)
}
```

## Path Parameters

Gorilla Mux uses `{param}` style, which maps directly to OpenAPI:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true"`
}

api.Get("/users/{id}",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```
