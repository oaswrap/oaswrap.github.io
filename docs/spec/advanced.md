---
sidebar_position: 8
---

# Advanced Features

## Generic Response Types

oaswrap/spec fully supports Go generics for response wrapping patterns:

```go
type APIResponse[T any] struct {
    Success   bool   `json:"success"`
    Data      T      `json:"data,omitempty"`
    Error     string `json:"error,omitempty"`
    Timestamp string `json:"timestamp"`
}

type PaginatedResponse[T any] struct {
    Items      T   `json:"items"`
    Total      int `json:"total"`
    Page       int `json:"page"`
    PageSize   int `json:"page_size"`
}

r.Get("/users",
    option.Response(200, new(PaginatedResponse[[]User])),
)

r.Get("/users/{id}",
    option.Response(200, new(APIResponse[User])),
    option.Response(404, new(APIResponse[any])),
)
```

## Spec Validation

Validate the generated spec before writing it:

```go
if err := r.Validate(); err != nil {
    log.Fatalf("Invalid OpenAPI spec: %v", err)
}
```

## Writing Specs

Multiple output formats and destinations:

```go
// Write YAML to file
if err := r.WriteSchemaTo("openapi.yaml"); err != nil {
    log.Fatal(err)
}

// Write JSON to file
if err := r.WriteSchemaTo("openapi.json"); err != nil {
    log.Fatal(err)
}

// Get raw YAML bytes
yamlBytes, err := r.MarshalYAML()

// Get raw JSON bytes
jsonBytes, err := r.MarshalJSON()

// Generate with format selection
bytes, err := r.GenerateSchema("yaml")
bytes, err := r.GenerateSchema("json")
```

## OpenAPI 3.1 Support

Switch to OpenAPI 3.1 by setting the version:

```go
r := spec.NewRouter(
    option.WithOpenAPIVersion("3.1.0"),
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),
)
```

## Rich Schema Documentation

Struct tags map directly to JSON Schema constraints:

```go
type Product struct {
    ID          string   `json:"id" format:"uuid" description:"Unique product identifier"`
    Name        string   `json:"name" required:"true" minLength:"1" maxLength:"200"`
    Price       float64  `json:"price" required:"true" minimum:"0" exclusiveMinimum:"true"`
    Currency    string   `json:"currency" enum:"USD,EUR,GBP" default:"USD"`
    Tags        []string `json:"tags,omitempty" maxItems:"10" uniqueItems:"true"`
    Description string   `json:"description,omitempty" maxLength:"2000"`
    CreatedAt   string   `json:"created_at" format:"date-time" readOnly:"true"`
}
```

For the complete list of supported tags, see:
- [swaggest/openapi-go features](https://github.com/swaggest/openapi-go#features)
- [swaggest/jsonschema-go field tags](https://github.com/swaggest/jsonschema-go#field-tags)

## Embedding Spec in Binary

Combine with `spec-ui` to serve the spec from an embedded file:

```go
import (
    "embed"
    specui "github.com/oaswrap/spec-ui"
    "github.com/oaswrap/spec-ui/swaggerui"
)

//go:embed openapi.yaml
var specFS embed.FS

handler := specui.NewHandler(
    specui.WithSpecEmbedFS("openapi.yaml", specFS),
    swaggerui.WithUI(),
)
```

## Runtime Spec Generation

Use `WithSpecGenerator` to generate the spec at request time:

```go
type myGenerator struct {
    router spec.Generator
}

func (g *myGenerator) MarshalYAML() ([]byte, error) {
    return g.router.MarshalYAML()
}

handler := specui.NewHandler(
    specui.WithSpecGenerator(&myGenerator{router: r}),
    swaggerui.WithUI(),
)
```
