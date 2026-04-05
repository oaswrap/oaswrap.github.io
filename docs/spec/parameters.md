---
sidebar_position: 6
---

# Parameters & Models

Define request and response models using Go structs. Parameters are declared using struct tags that map to OpenAPI parameter locations.

## Request Body

Use `option.Request()` to set the request body model:

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

Common schema tags:

| Tag | Description |
|-----|-------------|
| `required:"true"` | Mark field as required |
| `description:"..."` | Field description |
| `format:"email"` | OpenAPI format (email, uri, date-time, etc.) |
| `minimum:"n"` | Minimum value for numbers |
| `maximum:"n"` | Maximum value for numbers |
| `minLength:"n"` | Minimum string length |
| `maxLength:"n"` | Maximum string length |
| `minItems:"n"` | Minimum array items |
| `maxItems:"n"` | Maximum array items |
| `enum:"a,b,c"` | Allowed values |
| `pattern:"..."` | Regex pattern |
| `default:"..."` | Default value |
| `example:"..."` | Example value |

For the complete list of supported tags, see [swaggest/jsonschema-go](https://github.com/swaggest/jsonschema-go#field-tags).

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
