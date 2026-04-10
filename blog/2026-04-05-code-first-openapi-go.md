---
slug: code-first-openapi-go
title: "Code-First OpenAPI in Go: Comparing spec, Huma, Fuego, and swag"
date: 2026-04-05
authors: [ahmad_faiz]
tags: [openapi, go, comparison]
---

If you've maintained an OpenAPI spec by hand, you know the pain. The spec drifts from the code. A field gets renamed, a response changes, a new error code gets added — and the documentation doesn't follow. The solution most teams eventually reach is generating the spec from code, not maintaining it alongside it.

In the Go ecosystem, there are a few notable tools for this: **swag** (the annotation-based approach that many teams still use today), and a newer generation of code-first libraries — **oaswrap/spec**, **Huma**, and **Fuego**. They all solve the same problem, but with meaningfully different philosophies. This post walks through each one and helps you figure out which fits your situation.

<!-- truncate -->

## Two generations of API documentation

The older approach, best represented by swag, is annotation-based: you write structured comments above your handlers, run a code generator, and get a spec. It's familiar to anyone who has used Javadoc or Swagger's original Java tooling.

The newer approach is code-first: your Go types, function signatures, or explicit declarations are the source of truth. No separate generation step, no string-based annotations, no drift between the comment and the code it sits above.

Both are valid, and millions of production APIs use each. The question is which trade-offs you're willing to accept.

## swag

swag (swaggo) is the most widely adopted OpenAPI tool in the Go ecosystem and has been around the longest. It works by parsing structured comments on your handler functions and using `swag init` to generate a `docs/` folder with the resulting spec files.

```go
// @title        User API
// @version      1.0
// @description  A simple user management API
// @host         localhost:8080
// @BasePath     /api/v1

// ShowUser godoc
// @Summary      Get user by ID
// @Description  Retrieve a user by their unique identifier
// @Tags         users
// @Accept       json
// @Produce      json
// @Param        id   path      int           true  "User ID"
// @Success      200  {object}  model.User
// @Failure      404  {object}  model.ErrorResponse
// @Security     BearerAuth
// @Router       /users/{id} [get]
func (c *Controller) GetUser(ctx *gin.Context) {
    // implementation
}
```

After annotating your handlers, you run `swag init` to regenerate the docs, then serve the Swagger UI:

```go
import _ "myapp/docs" // generated package

r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
```

swag supports a broad range of frameworks — Gin, Echo, Chi, Fiber, `net/http`, Gorilla Mux — and has a large, active community with good editor support.

The limitation is inherent to the annotation model. The comments are strings. The compiler doesn't check them. If you rename `model.User` to `model.UserResponse` and forget to update the `@Success` line above five handlers, your spec silently diverges. `swag init` must be re-run after every change, and it's easy to forget in fast-moving codebases or forget to include in CI.

**Best for:** teams with existing Gin or Echo codebases who want documentation with minimal disruption, or organizations where the annotation style is already established and familiar.

## oaswrap/spec

`spec` is a documentation builder, not a framework. It generates an OpenAPI spec from pure Go code — no annotations, no code generation, no reflection magic beyond what's already in your struct tags.

```go
r := spec.NewRouter(
    option.WithTitle("User API"),
    option.WithVersion("1.0.0"),
)

r.Get("/users/{id}",
    option.OperationID("getUserByID"),
    option.Summary("Get user by ID"),
    option.Response(200, new(User)),
    option.Response(404, new(ErrorResponse)),
    option.Security("bearerAuth"),
)

r.WriteSchemaTo("openapi.yaml")
```

Your HTTP handler lives elsewhere — registered on Chi, Echo, Gin, or whatever you're using. The spec registration is separate but adjacent. Framework adapters can merge both into one call, eliminating the duplication:

```go
// With the Chi adapter: one call registers the route on Chi and the spec on spec.Router
adapter.Get("/users/{id}", handlers.GetUser,
    option.Response(200, new(User)),
    option.Response(404, new(ErrorResponse)),
)
```

Unlike swag, the spec is Go code, so it's checked at compile time. No separate generation step — the spec is built whenever your program runs, or written to disk as a build step. Generic response types, OpenAPI 3.0 and 3.1, YAML and JSON output, nested groups with inherited security and tags — all expressed in regular Go.

**Best for:** projects that already have an HTTP layer and want to add documentation without restructuring handlers, or CI/CD pipelines where spec files are generated and committed as build artifacts.

## Huma

Huma takes a "bring your own router" approach but asks you to define handlers in its style. You wrap your existing router with `humachi.New()` or `humago.New()`, then register operations with `huma.Register()`:

```go
huma.Register(api, huma.Operation{
    OperationID: "get-user",
    Method:      http.MethodGet,
    Path:        "/users/{id}",
    Summary:     "Get user by ID",
    Tags:        []string{"Users"},
}, func(ctx context.Context, input *struct {
    ID string `path:"id" doc:"User ID"`
}) (*struct {
    Body User
}, error) {
    // handler logic
    return &struct{ Body User }{Body: user}, nil
})
```

The key design is that inputs and outputs are declared as anonymous structs directly in the handler signature. Huma reflects over these to build the full OpenAPI schema — path params, query params, request body, response shape — all from struct tags. Write the handler once, and the spec follows automatically. No drift because there's no separate declaration.

Huma also validates incoming requests against the schema before your handler runs. You get runtime protection against malformed input without writing validation code yourself.

The trade-off is the handler signature feels foreign compared to standard Go HTTP handlers. The `Body` struct wrapping pattern is a convention you have to learn and follow consistently throughout your codebase.

**Best for:** greenfield APIs where you want the spec tightly coupled to handler logic, and teams that benefit from built-in request validation without adding a separate validation library.

## Fuego

Fuego is the most opinionated of the four. It's a full HTTP framework built on Go 1.22's `net/http`, designed to eliminate boilerplate while generating OpenAPI as a natural side effect.

The defining feature is that handler function signatures carry the input and output shapes as generic type parameters:

```go
type CreateUserInput struct {
    Name  string `json:"name" validate:"required"`
    Email string `json:"email" validate:"required,email"`
}

type UserOutput struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

fuego.Post(s, "/users", func(c fuego.ContextWithBody[CreateUserInput]) (*UserOutput, error) {
    body, err := c.Body()
    if err != nil {
        return nil, err
    }
    return &UserOutput{ID: "123", Name: body.Name, Email: body.Email}, nil
})
```

Fuego reads the generic type parameters to build the schema. JSON deserialization and `go-playground/validator` validation run automatically before your handler — you call `c.Body()` and get a typed, validated struct. Error handling is standardized as RFC 9457 problem details across all endpoints.

The downside is you're fully inside Fuego's world. `ContextWithBody[T]` is not a `http.Handler`, so existing middleware needs an adaptor layer. There are fewer escape hatches when you need to do something non-standard.

**Best for:** new projects, teams coming from NestJS or FastAPI who want a similar experience in Go, and APIs where consistency and low ceremony matter more than flexibility.

## Side-by-side comparison

| | swag | oaswrap/spec | Huma | Fuego |
|---|---|---|---|---|
| **Approach** | Annotations | Explicit Go code | Handler-inferred | Generics-inferred |
| **Generation step** | `swag init` required | None | None | None |
| **Type safety** | Limited (string comments) | Full | Full | Full |
| **HTTP layer** | Your choice | Your choice | Your choice (wrapped) | Built-in (net/http) |
| **Request validation** | None | None (spec only) | Automatic | Automatic |
| **Existing codebase** | Easy to add | Easy to add | Requires handler rewrite | Requires handler rewrite |
| **Framework lock-in** | None | None | Low | Medium |
| **OpenAPI version** | 2.0 (Swagger) | 3.0 + 3.1 | 3.1 | 3.0 |
| **Learning curve** | Low | Low | Medium | Medium |

One thing worth calling out: swag generates Swagger 2.0, not OpenAPI 3.x. For most tooling that distinction doesn't matter, but if you need OpenAPI 3.x features — better schema composition, webhooks, `anyOf`/`oneOf`, links — swag isn't an option without its 3.0 experimental flag.

## How to choose

**Use swag** if you have an existing codebase annotated with swag comments and it's working well. Migration to a different approach carries real cost and the annotation model is not wrong — it's just limited. If drift and type safety haven't been painful for your team, there's no urgent reason to switch.

**Use oaswrap/spec** if you want to move away from annotations without touching your handlers. It's the least disruptive upgrade path from swag: your HTTP layer stays identical, you replace comment blocks with Go options, and you get type-safe, code-first spec generation in return.

**Use Huma** if you're willing to rewrite handlers in exchange for automatic spec generation and built-in validation. The "bring your own router" story means you're not locked into a new HTTP framework, just a new handler style.

**Use Fuego** if you're starting fresh and want the fastest path to a well-documented, validated API with minimal boilerplate. The framework makes many decisions for you — that's the trade-off, and for greenfield projects it's often the right one.

---

If you're looking to get started with `oaswrap/spec`, check out the [quick start guide](/docs/spec/quick-start) or the [adapter documentation](/docs/spec/adapters/overview) for the tighter integration with your existing framework.
