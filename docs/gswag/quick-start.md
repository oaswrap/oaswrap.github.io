---
sidebar_position: 3
---

# Quick Start

A gswag test suite has two parts: a **suite file** that configures the spec and the test server, and one or more **spec files** that describe API operations using the DSL.

## 1. Configure the suite

```go
// suite_test.go
package api_test

import (
    "net/http/httptest"
    "testing"

    . "github.com/oaswrap/gswag"
    . "github.com/onsi/ginkgo/v2"
    . "github.com/onsi/gomega"
)

var testServer *httptest.Server

func TestAPI(t *testing.T) {
    RegisterFailHandler(Fail)
    RunSpecs(t, "API Suite")
}

var _ = BeforeSuite(func() {
    Init(&Config{
        Title:      "My API",
        Version:    "1.0.0",
        OutputPath: "./docs/openapi.yaml",
    })

    testServer = httptest.NewServer(NewRouter()) // your http.Handler
    SetTestServer(testServer)
})

var _ = AfterSuite(func() {
    testServer.Close()
    Expect(WriteSpec()).To(Succeed())
})
```

### Shorthand for single-process suites

`RegisterSuiteHandlers` combines `Init`, `SetTestServer`, and `WriteSpec` into one call:

```go
func TestAPI(t *testing.T) {
    gswag.RegisterSuiteHandlers(&gswag.Config{
        Title:      "My API",
        Version:    "1.0.0",
        OutputPath: "./docs/openapi.yaml",
    }, httptest.NewServer(NewRouter()))
    RegisterFailHandler(Fail)
    RunSpecs(t, "API Suite")
}
```

## 2. Write spec tests

```go
// users_test.go
package api_test

import (
    "net/http"

    . "github.com/oaswrap/gswag"
    . "github.com/onsi/gomega"
)

type User struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

type CreateUserRequest struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

var _ = Path("/users", func() {
    Get("List users", func() {
        Tag("users")

        Response(200, "list of users", func() {
            ResponseSchema(new([]User))
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusOK))
                Expect(resp).To(HaveNonEmptyBody())
            })
        })
    })

    Post("Create user", func() {
        Tag("users")
        RequestBody(new(CreateUserRequest))

        Response(201, "user created", func() {
            ResponseSchema(new(User))
            SetBody(&CreateUserRequest{Name: "Alice", Email: "alice@example.com"})
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusCreated))
                Expect(resp).To(ContainJSONKey("id"))
            })
        })
    })
})

var _ = Path("/users/{id}", func() {
    Get("Get user by ID", func() {
        Tag("users")
        Parameter("id", PathParam, String)

        Response(200, "user found", func() {
            ResponseSchema(new(User))
            SetParam("id", "1")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusOK))
                Expect(resp).To(MatchJSONSchema(&User{}))
            })
        })

        Response(404, "user not found", func() {
            SetParam("id", "9999")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusNotFound))
            })
        })
    })
})
```

## 3. Run the suite

```bash
go test ./...
```

When the suite finishes, `./docs/openapi.yaml` is written. Run it again any time to regenerate.

## 4. (Optional) Serve the spec with spec-ui

Pair the generated spec with [`oaswrap/spec-ui`](/docs/spec-ui/introduction) to serve interactive API documentation:

```go
import (
    specui "github.com/oaswrap/spec-ui"
    "github.com/oaswrap/spec-ui/swaggerui"
)

handler := specui.NewHandler(
    specui.WithSpecFile("./docs/openapi.yaml"),
    swaggerui.WithUI(),
)
http.Handle("/docs/", handler)
```
