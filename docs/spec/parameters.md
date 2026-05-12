---
sidebar_position: 6
---

# Parameters & Models

Define request and response models using Go structs. Parameters are declared using struct tags that map to OpenAPI parameter locations.

## Request Body

Use `option.Request()` to set the request body model. The `json` tag controls the field name in the serialized body:

```go
type CreateUserRequest struct {
    Name  string `json:"name" required:"true"`
    Email string `json:"email" required:"true"`
}

r.Post("/users",
    option.Summary("Create user"),
    option.Request(new(CreateUserRequest)),
    option.Response(201, new(User)),
)
```

For `application/x-www-form-urlencoded` or `multipart/form-data` bodies, use the `form` tag:

```go
type UploadRequest struct {
    File  string `form:"file"  required:"true"`
    Label string `form:"label"`
}

r.Post("/upload",
    option.Request(new(UploadRequest), option.ContentType("multipart/form-data")),
)
```

## Path Parameters

Path parameters are defined with the `path` struct tag:

```go
type GetUserRequest struct {
    ID string `path:"id" required:"true" description:"User identifier"`
}

r.Get("/users/{id}",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```

## Query Parameters

Use the `query` struct tag:

```go
type ListUsersRequest struct {
    Page     int    `query:"page" description:"Page number" minimum:"1"`
    PageSize int    `query:"page_size" description:"Items per page" minimum:"1" maximum:"100"`
    Search   string `query:"search" description:"Search term"`
    Active   *bool  `query:"active" description:"Filter by active status"`
}

r.Get("/users",
    option.Request(new(ListUsersRequest)),
    option.Response(200, new([]User)),
)
```

## OpenAPI 3.2 Querystring Parameters

For OpenAPI `3.2.0`, you can model whole-query-string parameters with the `querystring` tag:

```go
type SearchRequest struct {
    Raw string `querystring:"q" mediaType:"application/x-www-form-urlencoded"`
}
```

## Header Parameters

Use the `header` struct tag:

```go
type AuthenticatedRequest struct {
    APIKey string `header:"X-API-Key" required:"true" description:"API authentication key"`
    Locale string `header:"Accept-Language" description:"Preferred language"`
}
```

## Responses

Use `option.Response()` to define responses. Multiple responses can be added per route:

```go
r.Get("/users/{id}",
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User),
        option.ContentDescription("Successful response"),
        option.ContentType("application/json"),
    ),
    option.Response(404, new(ErrorResponse),
        option.ContentDescription("User not found"),
    ),
    option.Response(401, new(ErrorResponse)),
)
```

## Schema Validation Tags

Rich schema constraints are defined with struct tags:

```go
type CreateUserRequest struct {
    Name     string   `json:"name" required:"true" minLength:"2" maxLength:"50"`
    Email    string   `json:"email" required:"true" format:"email"`
    Age      int      `json:"age" minimum:"18" maximum:"120"`
    Tags     []string `json:"tags" maxItems:"10"`
    Bio      string   `json:"bio,omitempty" description:"User biography"`
    Role     string   `json:"role" enum:"admin,user,guest"`
}
```

### Naming tags

| Tag | Applies to | Description |
|-----|-----------|-------------|
| `json:"name"` | body fields | Field name in JSON request/response body |
| `form:"name"` | body fields | Field name in form-encoded or multipart body |
| `query:"name"` | query params | Field name as a query parameter |
| `path:"name"` | path params | Field name as a path parameter |
| `header:"name"` | header params | Field name as a request header |
| `querystring:"name"` | OAS 3.2 | Whole-struct as a querystring parameter |

Use `json:"-"` to exclude a field from any schema. Any field with `json:"-"` is also excluded from non-JSON schemes.

### Overriding tag sources

The reflector supports overriding which struct tag is used for a particular parameter location. Use `option.ParameterTagMapping` (via `option.WithReflectorConfig`) to change the tag source for `path`, `query`, `header`, and now also `body` and `form` parameters.

Example (use `uri` tags for path parameters and `form` tags for form bodies):

```go
r := spec.NewRouter(
    option.WithReflectorConfig(
        option.ParameterTagMapping(openapi.ParameterInPath, "uri"),
        option.ParameterTagMapping(openapi.ParameterInForm, "form"),
    ),
)
```

This is useful when your framework uses different tag names (e.g., `uri`, `form`) than the defaults (`json`, `form`).

### Embedded struct referencing and `refer:"true"`

By default embedded structs are inlined into the parent schema. To preserve them as component references (using `allOf: [{"$ref": "..."}]`), implement the `EmbedReferencer` interface or annotate the embedded field with `refer:"true"`.

This keeps component reuse and makes generated schemas easier to read and maintain.


### Schema constraint tags

| Tag | Type | Description |
|-----|------|-------------|
| `required:"true"` | bool | Mark field as required |
| `type:"string"` | string | Override inferred type (supports comma-separated types in OAS 3.1+) |
| `title:"..."` | string | Schema title |
| `description:"..."` | string | Field description |
| `format:"email"` | string | OpenAPI format (`email`, `uri`, `date-time`, `uuid`, etc.) |
| `default:"..."` | any | Default value (parsed as JSON, then bool/int/float/string) |
| `example:"..."` | any | Example value |
| `examples:"[...]"` | JSON array | Multiple examples — OAS 3.1+ only |
| `enum:"a,b,c"` | list | Allowed values (comma-separated or JSON array) |
| `const:"v"` | any | Constant value — OAS 3.1+ only |
| `pattern:"..."` | string | Regex pattern |
| `minLength:"n"` | int | Minimum string length |
| `maxLength:"n"` | int | Maximum string length |
| `minimum:"n"` | float | Minimum numeric value |
| `maximum:"n"` | float | Maximum numeric value |
| `exclusiveMinimum:"n"` | float/bool | Exclusive lower bound (bool in OAS 3.0, number in OAS 3.1+) |
| `exclusiveMaximum:"n"` | float/bool | Exclusive upper bound (bool in OAS 3.0, number in OAS 3.1+) |
| `multipleOf:"n"` | float | Value must be a multiple of n |
| `minItems:"n"` | int | Minimum array items |
| `maxItems:"n"` | int | Maximum array items |
| `uniqueItems:"true"` | bool | Array items must be unique |
| `minProperties:"n"` | int | Minimum object properties |
| `maxProperties:"n"` | int | Maximum object properties |
| `nullable:"true"` | bool | Allow null — OAS 3.0 only (use `type:"t,null"` in OAS 3.1+) |
| `readOnly:"true"` | bool | Field appears only in responses |
| `writeOnly:"true"` | bool | Field appears only in requests |
| `deprecated:"true"` | bool | Mark field as deprecated |
| `contentEncoding:"..."` | string | Binary encoding hint (`base64`, etc.) — OAS 3.1+ only |
| `contentMediaType:"..."` | string | Media type of string content — OAS 3.1+ only |
| `mediaType:"..."` | string | Media type for querystring parameter content |

### XML tags

| Tag | Description |
|-----|-------------|
| `xmlName:"..."` | XML element name |
| `xmlNamespace:"..."` | XML namespace URI |
| `xmlPrefix:"..."` | XML namespace prefix |
| `xmlAttribute:"true"` | Render as XML attribute instead of element |
| `xmlWrapped:"true"` | Wrap array items in a parent element |
| `xmlNodeType:"..."` | XML node type — OAS 3.2 only (`attribute`, `element`) |

## Generic Response Types

Generic types are supported for wrapping responses:

```go
type APIResponse[T any] struct {
    Success   bool   `json:"success"`
    Data      T      `json:"data,omitempty"`
    Error     string `json:"error,omitempty"`
    Timestamp string `json:"timestamp"`
}

// In routes
r.Get("/users/{id}",
    option.Response(200, new(APIResponse[User])),
)

r.Get("/users",
    option.Response(200, new(APIResponse[[]User])),
)
```

## Content Options Reference

| Option | Description |
|--------|-------------|
| `ContentDescription(d)` | Set response description |
| `ContentType(t)` | Override content type (default: `application/json`) |
| `ContentDefault(true)` | Mark as the default response |
