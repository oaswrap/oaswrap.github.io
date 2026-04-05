---
sidebar_position: 1
slug: /intro
---

# Introduction

**OASWrap** is a collection of Go libraries for building and serving OpenAPI 3.x documentation without vendor lock-in.

## Libraries

### [spec](/docs/spec/introduction)

A lightweight, framework-agnostic OpenAPI 3.x specification builder. Write your API documentation in pure Go code with full type safety — no annotations, no code comments required.

```bash
go get github.com/oaswrap/spec
```

- Build specs programmatically in Go
- Works standalone or with any web framework
- Adapter ecosystem for Chi, Echo, Gin, Fiber, net/http, and more
- CI/CD ready for build-time spec generation

### [spec-ui](/docs/spec-ui/introduction)

Serve beautiful, interactive API documentation with multiple UI providers as standard Go HTTP handlers.

```bash
go get github.com/oaswrap/spec-ui
```

- 5 UI providers: Swagger UI, Stoplight Elements, ReDoc, Scalar, RapiDoc
- Works with any Go HTTP router
- CDN mode (lightweight) or embedded mode (air-gapped deployments)
- Switch providers by changing a single import

## How They Work Together

`spec` generates your OpenAPI specification. `spec-ui` serves it as interactive documentation. You can use them independently or together:

```go
// Generate the spec
r := spec.NewRouter(
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),
)
r.Get("/users", option.Summary("List users"), option.Response(200, new([]User)))
r.WriteSchemaTo("openapi.yaml")

// Serve the spec as interactive docs
handler := specui.NewHandler(
    specui.WithSpecFile("openapi.yaml"),
    swaggerui.WithUI(),
)
```

Framework adapters (`chiopenapi`, `ginopenapi`, etc.) combine both — automatically generating the spec from your routes and serving the documentation UI.
