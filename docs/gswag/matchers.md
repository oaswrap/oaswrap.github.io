---
sidebar_position: 6
---

# Gomega Matchers

gswag ships a set of Gomega matchers that operate on `*http.Response`. Import them alongside `gomega`:

```go
import (
    . "github.com/oaswrap/gswag"
    . "github.com/onsi/gomega"
)
```

All matchers are used with `Expect(resp).To(...)` inside a `RunTest` callback.

## Reference

### HaveStatus

Assert the HTTP status code:

```go
Expect(resp).To(HaveStatus(http.StatusOK))
Expect(resp).To(HaveStatus(200))
```

### HaveStatusInRange

Assert the status code falls within an inclusive range:

```go
Expect(resp).To(HaveStatusInRange(200, 299))
Expect(resp).To(HaveStatusInRange(400, 499))
```

### HaveHeader

Assert a response header value:

```go
Expect(resp).To(HaveHeader("Content-Type", "application/json"))
Expect(resp).To(HaveHeader("X-Request-ID", "abc123"))
```

### HaveJSONBody

Assert the entire JSON response body equals an expected value (deep equality):

```go
Expect(resp).To(HaveJSONBody(map[string]any{
    "id":   "1",
    "name": "Alice",
}))
```

### ContainJSONKey

Assert the JSON body contains a key at the top level:

```go
Expect(resp).To(ContainJSONKey("id"))
Expect(resp).To(ContainJSONKey("error"))
```

### MatchJSONSchema

Assert the JSON body matches the schema derived from a Go type:

```go
Expect(resp).To(MatchJSONSchema(&User{}))
Expect(resp).To(MatchJSONSchema(new([]Item)))
```

This is useful as a lightweight contract test — it fails if required fields are missing or types are wrong.

### HaveNonEmptyBody

Assert the response body is non-empty:

```go
Expect(resp).To(HaveNonEmptyBody())
```

## Complete example

```go
var _ = Path("/users/{id}", func() {
    Get("Get user by ID", func() {
        Tag("users")
        Parameter("id", PathParam, String)

        Response(200, "user found", func() {
            ResponseSchema(new(User))
            SetParam("id", "1")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusOK))
                Expect(resp).To(HaveHeader("Content-Type", "application/json"))
                Expect(resp).To(ContainJSONKey("id"))
                Expect(resp).To(MatchJSONSchema(&User{}))
            })
        })

        Response(404, "user not found", func() {
            SetParam("id", "9999")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusNotFound))
                Expect(resp).To(ContainJSONKey("error"))
            })
        })
    })
})
```
