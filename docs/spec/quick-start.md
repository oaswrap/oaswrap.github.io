---
sidebar_position: 3
---

# Quick Start

## Static Spec Generation

For CI/CD pipelines and build-time spec generation:

```go
package main

import (
	"log"

	"github.com/oaswrap/spec"
	"github.com/oaswrap/spec/option"
)

func main() {
	// Create a new OpenAPI router
	r := spec.NewRouter(
		option.WithTitle("My API"),
		option.WithVersion("1.0.0"),
		option.WithServer("https://api.example.com"),
		option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("Bearer")),
	)

	// Add routes
	v1 := r.Group("/api/v1")

	v1.Post("/login",
		option.Summary("User login"),
		option.Request(new(LoginRequest)),
		option.Response(200, new(LoginResponse)),
	)

	auth := v1.Group("/", option.GroupSecurity("bearerAuth"))

	auth.Get("/users/{id}",
		option.Summary("Get user by ID"),
		option.Request(new(GetUserRequest)),
		option.Response(200, new(User)),
	)

	// Write OpenAPI spec to file
	if err := r.WriteSchemaTo("openapi.yaml"); err != nil {
		log.Fatal(err)
	}

	log.Println("OpenAPI spec generated at openapi.yaml")
}

type LoginRequest struct {
	Username string `json:"username" required:"true"`
	Password string `json:"password" required:"true"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type GetUserRequest struct {
	ID string `path:"id" required:"true"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
```

## Framework Integration

For seamless HTTP server integration, use a framework adapter. See the [Adapters](/docs/spec/adapters/overview) section for framework-specific guides.

Here's a quick example using Chi:

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
	)

	api.Get("/users",
		option.Summary("List users"),
		option.Response(200, new([]User)),
	)

	// Documentation automatically available at /docs
	// OpenAPI spec at /docs/openapi.yaml
	http.ListenAndServe(":8080", r)
}
```

## Generating the Spec

You have several options for getting the spec output:

```go
// Write to a file
r.WriteSchemaTo("openapi.yaml")

// Get YAML bytes
yamlBytes, err := r.MarshalYAML()

// Get JSON bytes
jsonBytes, err := r.MarshalJSON()

// Validate the spec
err := r.Validate()
```
