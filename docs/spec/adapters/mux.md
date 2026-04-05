---
sidebar_position: 7
---

# Gorilla Mux & HTTPRouter

## Gorilla Mux

Integration with [gorilla/mux](https://github.com/gorilla/mux), a powerful HTTP router and URL matcher.

### Installation

```bash
go get github.com/oaswrap/spec/adapter/muxopenapi
```

### Usage

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

	// Docs at /docs, spec at /docs/openapi.yaml
	http.ListenAndServe(":8080", r)
}
```

---

## HTTPRouter

Integration with [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter), a high-performance HTTP request router.

### Installation

```bash
go get github.com/oaswrap/spec/adapter/httprouteropenapi
```

### Usage

```go
package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/oaswrap/spec/adapter/httprouteropenapi"
	"github.com/oaswrap/spec/option"
)

func main() {
	r := httprouter.New()

	api := httprouteropenapi.NewRouter(r,
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
	)

	api.Get("/users",
		option.Summary("List users"),
		option.Response(200, new([]User)),
	)

	api.Get("/users/:id",
		option.Summary("Get user by ID"),
		option.Request(new(GetUserRequest)),
		option.Response(200, new(User)),
	)

	// Docs at /docs, spec at /docs/openapi.yaml
	http.ListenAndServe(":8080", r)
}
```

HTTPRouter uses `:param` style. The adapter converts these to `{param}` for OpenAPI.
