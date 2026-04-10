---
sidebar_position: 4
---

# DSL Reference

The gswag DSL is imported with a dot import so all functions are available at the top level without a package prefix.

```go
import . "github.com/oaswrap/gswag"
```

## Paths and operations

`Path` creates a Ginkgo `Describe` container for a URL path. HTTP method functions nest inside it:

```go
Path("/users", func() {
    Get("List users", func() { ... })
    Post("Create user", func() { ... })
})

Path("/users/{id}", func() {
    Get("Get user", func() { ... })
    Put("Replace user", func() { ... })
    Patch("Update user", func() { ... })
    Delete("Delete user", func() { ... })
})
```

Paths can be nested. Segments are concatenated:

```go
Path("/api/v1", func() {
    Path("/users", func() {
        Get("List users", func() { ... })
    })
})
// → registers GET /api/v1/users
```

## Operation metadata

Call these inside an HTTP method block:

```go
Get("Summary goes here", func() {
    Tag("users", "admin")
    Description("Returns a single user by ID.")
    OperationID("getUserByID")
    Deprecated()
    Hidden() // test still runs; operation is excluded from the spec
})
```

| Function | Description |
|----------|-------------|
| `Tag(names...)` | Assign one or more tags |
| `Description(text)` | Set the operation description |
| `OperationID(id)` | Set a unique operation identifier |
| `Deprecated()` | Mark the operation as deprecated |
| `Hidden()` | Execute the test but omit from the spec |

## Parameters

### Individual parameters

```go
Parameter("id",           PathParam,   String)
Parameter("limit",        QueryParam,  Integer)
Parameter("X-Request-ID", HeaderParam, String)
Parameter("token",        CookieParam, String)
```

Parameter locations: `PathParam`, `QueryParam`, `HeaderParam`, `CookieParam`.

Schema types: `String`, `Integer`, `Number`, `Boolean`, `Array`, `Object`.

### Typed query struct

Map a struct to multiple query parameters at once using `query` struct tags:

```go
type ListQuery struct {
    Search string `query:"search"`
    Page   int    `query:"page"`
    Limit  int    `query:"limit"`
}

QueryParamStruct(new(ListQuery))
```

## Request body

```go
Post("Create user", func() {
    RequestBody(new(CreateUserRequest))
    ...
})
```

By default the content type is `application/json`. Override with `Consumes`:

```go
Post("Upload file", func() {
    Consumes("multipart/form-data")
    RequestBody(new(UploadForm))
    ...
})
```

## Response blocks

`Response` creates a Ginkgo `Context` that documents one HTTP status code and runs one test case:

```go
Response(200, "user found", func() {
    ResponseSchema(new(User))
    ResponseHeader("X-Rate-Limit", "requests remaining")

    // execution values — sent with the HTTP request
    SetParam("id", "1")
    SetQueryParam("verbose", "true")
    SetHeader("Authorization", "Bearer token")
    SetBody(&CreateUserRequest{Name: "Alice"})

    RunTest(func(resp *http.Response) {
        Expect(resp).To(HaveStatus(http.StatusOK))
    })
})
```

### Response execution setters

| Setter | Description |
|--------|-------------|
| `SetParam(name, value)` | Set a path parameter |
| `SetQueryParam(name, value)` | Set a query parameter |
| `SetHeader(name, value)` | Set a request header |
| `SetBody(body)` | Set a JSON-encoded request body |
| `SetRawBody(data, contentType)` | Set a raw request body with explicit content type |

These values are used **only** during test execution. They do not affect the spec structure.

### ResponseSchema

Declares the Go type that documents the response body schema:

```go
ResponseSchema(new(User))
ResponseSchema(new([]User))
```

### ResponseHeader

Documents a response header in the spec:

```go
ResponseHeader("X-Rate-Limit", "Number of remaining requests")
ResponseHeader("X-Request-ID", "")
```

## Content types

```go
Post("Upload file", func() {
    Consumes("multipart/form-data")
    Produces("application/json")
    ...
})

Get("Export", func() {
    Produces("application/json", "text/csv") // multiple response types
    ...
})
```

`Consumes` sets the request body content type (default: `application/json`).
`Produces` sets the response content type (default: `application/json`).

## Security

### Applying security to operations

```go
Get("Get user", func() {
    BearerAuth()           // uses the "bearerAuth" scheme
    Security("apiKey")     // any named scheme
})
```

### Defining schemes in Config

Security schemes are declared once in `Init`:

```go
Init(&Config{
    SecuritySchemes: map[string]SecuritySchemeConfig{
        "bearerAuth": BearerJWT(),
        "apiKey":     APIKeyHeader("X-API-Key"),
        "apiKeyQuery": APIKeyQuery("api_key"),
        "apiKeyCookie": APIKeyCookie("session"),
        "oauth2": OAuth2Implicit("https://example.com/oauth/authorize", map[string]string{
            "read:users":  "read users",
            "write:users": "modify users",
        }),
    },
})
```

## Shared setup with BeforeRequest

`BeforeRequest` is a thin wrapper around Ginkgo's `BeforeEach`. Use it to share setup across multiple `Response` blocks in one operation:

```go
Get("Get order", func() {
    Parameter("id", PathParam, String)

    BeforeRequest(func() {
        SetHeader("Authorization", "Bearer test-token")
    })

    Response(200, "order found", func() {
        SetParam("id", "42")
        RunTest(func(resp *http.Response) {
            Expect(resp).To(HaveStatus(http.StatusOK))
        })
    })

    Response(404, "order not found", func() {
        SetParam("id", "9999")
        RunTest(func(resp *http.Response) {
            Expect(resp).To(HaveStatus(http.StatusNotFound))
        })
    })
})
```

> `BeforeRequest` runs during test execution (Ginkgo `BeforeEach`), so it is for values known only at runtime. Values known at tree-construction time should go directly inside the `Response` block.

## RunTest

`RunTest` registers the Ginkgo `It` block that fires the actual HTTP request. It accepts an optional callback that receives the `*http.Response`:

```go
// Assert the response
RunTest(func(resp *http.Response) {
    Expect(resp).To(HaveStatus(http.StatusOK))
    Expect(resp).To(ContainJSONKey("id"))
})

// No assertions (spec generation only)
RunTest()
```
