---
slug: test-driven-api-docs-gswag
title: "Test-Driven API Documentation with gswag and Ginkgo"
date: 2026-04-10
authors: [ahmad_faiz]
---

Most Go projects treat API documentation as a separate task from testing. You write the handlers, write the tests, then — separately — write OpenAPI annotations or maintain a spec file by hand. The docs drift. The tests pass. Nobody notices until a consumer hits an undocumented edge case.

`gswag` takes a different approach: your OpenAPI spec is generated as a side-effect of running your Ginkgo integration tests. If the test passes, the spec reflects what your API actually does.

<!-- truncate -->

## The core idea

`gswag` wraps Ginkgo's `Describe` / `It` lifecycle. You describe API operations using a nested DSL — path, method, parameters, request/response schemas — and each `Response` block fires a real HTTP request against a `httptest.Server`. When the suite finishes, `WriteSpec()` serialises everything the tests observed into an OpenAPI 3.0 YAML file.

Three things happen in one test run:

1. Operations are registered from DSL metadata (path, method, params, schemas, security)
2. Real HTTP requests assert that your handlers behave correctly
3. The spec is written from what was actually tested

No annotations. No code generation step. No separate doc maintenance.

## Setting up the suite

Create a `suite_test.go` that initialises gswag and wires up your test server:

```go
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
        Title:      "Items API",
        Version:    "1.0.0",
        OutputPath: "./docs/openapi.yaml",
    })
    testServer = httptest.NewServer(NewRouter())
    SetTestServer(testServer)
})

var _ = AfterSuite(func() {
    testServer.Close()
    Expect(WriteSpec()).To(Succeed())
})
```

`Init` configures the spec. `SetTestServer` tells gswag where to send requests. `WriteSpec` flushes the collected spec to disk after all tests run.

## Writing a spec test

Each file describes a group of API operations. Here is a complete example covering list, create, get, and delete:

```go
package api_test

import (
    "net/http"

    . "github.com/oaswrap/gswag"
    . "github.com/onsi/gomega"
)

type Item struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Price float64 `json:"price"`
}

type CreateItemRequest struct {
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}

type ListQuery struct {
    Search string `query:"search"`
    Page   int    `query:"page"`
}

var _ = Path("/items", func() {
    Get("List items", func() {
        Tag("items")
        QueryParamStruct(new(ListQuery))

        Response(200, "list of items", func() {
            ResponseSchema(new([]Item))
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusOK))
                Expect(resp).To(HaveNonEmptyBody())
            })
        })
    })

    Post("Create item", func() {
        Tag("items")
        RequestBody(new(CreateItemRequest))

        Response(201, "item created", func() {
            ResponseSchema(new(Item))
            SetBody(&CreateItemRequest{Name: "Wrench", Price: 9.99})
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusCreated))
                Expect(resp).To(ContainJSONKey("id"))
            })
        })

        Response(400, "invalid input", func() {
            SetRawBody([]byte("not json"), "application/json")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusBadRequest))
            })
        })
    })
})

var _ = Path("/items/{id}", func() {
    Get("Get item by ID", func() {
        Tag("items")
        Parameter("id", PathParam, Integer)

        Response(200, "item found", func() {
            ResponseSchema(new(Item))
            SetParam("id", "1")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusOK))
                Expect(resp).To(MatchJSONSchema(&Item{}))
            })
        })

        Response(404, "item not found", func() {
            SetParam("id", "9999")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusNotFound))
            })
        })
    })

    Delete("Delete item", func() {
        Tag("items")
        Parameter("id", PathParam, Integer)

        Response(204, "item deleted", func() {
            SetParam("id", "1")
            RunTest(func(resp *http.Response) {
                Expect(resp).To(HaveStatus(http.StatusNoContent))
            })
        })
    })
})
```

Each `Response` block is a separate `It` node in Ginkgo — an independent test case. The 400 block sends malformed JSON and asserts the handler rejects it. That negative case is documented in the spec alongside the happy path, because gswag recorded it too.

## Running the suite

```bash
go test ./...
```

When the suite finishes, `./docs/openapi.yaml` is written. The spec only contains operations that were actually tested — nothing can slip in undocumented.

## What the spec looks like

```yaml
openapi: 3.0.3
info:
  title: Items API
  version: 1.0.0
paths:
  /items:
    get:
      tags: [items]
      summary: List items
      parameters:
        - name: search
          in: query
          schema: { type: string }
        - name: page
          in: query
          schema: { type: integer }
      responses:
        "200":
          description: list of items
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Item' }
    post:
      tags: [items]
      summary: Create item
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateItemRequest' }
      responses:
        "201":
          description: item created
          ...
        "400":
          description: invalid input
          ...
```

## Security, parallel suites, and more

gswag supports Bearer JWT, API keys, and OAuth2 security schemes. For parallel Ginkgo runs (`ginkgo -p`), each process writes a partial spec and node 1 merges them after all nodes finish — no extra configuration needed when using `RegisterParallelSuiteHandlers`.

You can also enable `CaptureExamples: true` to attach real response bodies as OpenAPI examples, and `EnforceResponseValidation: true` to fail tests when responses deviate from the declared schema.

Full reference in the [gswag documentation](/docs/gswag/introduction).
