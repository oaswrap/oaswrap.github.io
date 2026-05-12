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

## Reflection hooks and customization

The reflector exposes several hooks to customize how Go types map to OpenAPI schemas. Use `option.WithReflectorConfig(...)` to pass these options.

- InterceptSchema(fn) — run a callback for each reflected type to override or replace the generated schema.
- InterceptProp(fn) — run a callback for each struct field/property to customize its schema or metadata.
- RequiredPropByValidateTag() — convenience hook to mark fields as required when a `validate:"..."` tag contains `required`.

Example:

```go
r := spec.NewRouter(
    option.WithReflectorConfig(
        option.InterceptSchema(func(p openapi.InterceptSchemaParams) (bool, error) { /*...*/ }),
        option.RequiredPropByValidateTag(),
    ),
)
```

Hooks are chained when multiple callbacks are provided. See the `option` package for exact helper names and behavior.

## Schema name prefixes and package qualification

To avoid cross-package collisions, default component definition names now include the Go package name as a prefix (for example `models.User` → `ModelsUser`). Use `option.StripDefNamePrefix(...)` or `option.InterceptDefName(...)` to control or remove the prefix.

## Content-type detection and marshaler support

- When a content type is not explicitly provided via `option.ContentType(...)`, the reflector now attempts to infer the media type from Go types (e.g., `string` with `mediaType` tags, or types implementing text marshaling).
- Types implementing `encoding.TextMarshaler` and `encoding.TextUnmarshaler` (but not `json.Marshaler`) are reflected as `type: string`.

## Embedded struct referencing

Embedded structs can opt into being represented as `allOf: [ { "$ref": "..." } ]` instead of being inlined by implementing `EmbedReferencer` or using the `refer:"true"` struct tag on the embedded field. This helps preserve schema reuse and cleaner component references.


