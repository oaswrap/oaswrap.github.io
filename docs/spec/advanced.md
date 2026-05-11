---
sidebar_position: 8
---

# Advanced Features

## Generic Response Types

`oaswrap/spec` supports generics for response wrappers:

```go
type APIResponse[T any] struct {
    Success bool   `json:"success"`
    Data    T      `json:"data,omitempty"`
    Error   string `json:"error,omitempty"`
}

r.Get("/users/{id}",
    option.Response(200, new(APIResponse[User])),
    option.Response(404, new(APIResponse[any])),
)
```

## Validation and Validation Reports

`Validate()` returns strict validation failures (error severity only):

```go
if err := r.Validate(); err != nil {
    log.Fatalf("invalid OpenAPI spec: %v", err)
}
```

`ValidateReport()` returns all findings (errors, warnings, info):

```go
if err := r.ValidateReport(); err != nil {
    log.Printf("validation report: %v", err)
}
```

## Writing Specs

```go
if err := r.WriteSchemaTo("openapi.yaml"); err != nil {
    log.Fatal(err)
}

yamlBytes, err := r.MarshalYAML()
jsonBytes, err := r.MarshalJSON()
bytes, err := r.GenerateSchema("yaml")
bytes, err := r.GenerateSchema("json")
```

## OpenAPI 3.2 Features

Select OpenAPI 3.2 to enable additional features such as `QUERY` operations and newer OpenAPI fields:

```go
import "github.com/oaswrap/spec/openapi"

r := spec.NewRouter(
    option.WithOpenAPIVersion(openapi.Version320),
    option.WithSelf("https://api.example.com/openapi.yaml"),
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),
)

r.Query("/search", option.Summary("Search resources"))
```

## Rich Schema Documentation

Struct tags map directly to JSON Schema / OpenAPI constraints:

```go
type Product struct {
    ID       string   `json:"id" format:"uuid" description:"Unique product identifier"`
    Name     string   `json:"name" required:"true" minLength:"1" maxLength:"200"`
    Price    float64  `json:"price" required:"true" minimum:"0"`
    Currency string   `json:"currency" enum:"USD,EUR,GBP" default:"USD"`
    Tags     []string `json:"tags,omitempty" maxItems:"10" uniqueItems:"true"`
}
```

For the complete tag reference — naming tags, schema constraints, and XML tags — see [Parameters & Models](/docs/spec/parameters).
