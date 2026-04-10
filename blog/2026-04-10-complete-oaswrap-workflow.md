---
slug: complete-oaswrap-workflow
title: "From Tests to Docs: A Complete OASWrap Workflow"
date: 2026-04-10
authors: [ahmad_faiz]
---

The three OASWrap libraries each solve one piece of the API documentation problem. Used together, they cover the full journey from spec generation to serving interactive docs — with no annotations, no third-party services, and no spec drift.

This post walks through a complete workflow: generate the spec with `gswag` during CI, embed it into your binary, and serve it with `spec-ui`.

{/* truncate */}

## The three libraries

| Library | Role |
|---------|------|
| [`gswag`](/docs/gswag/introduction) | Generates the OpenAPI spec as a side-effect of Ginkgo integration tests |
| [`spec`](/docs/spec/introduction) | Generates the OpenAPI spec from Go code at build time (no tests required) |
| [`spec-ui`](/docs/spec-ui/introduction) | Serves the spec as interactive documentation via any Go HTTP handler |

`gswag` and `spec` are alternative paths to the same output — an OpenAPI YAML or JSON file. `spec-ui` consumes that file regardless of how it was produced.

## Step 1 — Generate the spec

### Option A: from integration tests with gswag

If you use Ginkgo, your spec comes for free from the tests you are already writing.

```go
// suite_test.go
var _ = BeforeSuite(func() {
    gswag.Init(&gswag.Config{
        Title:      "My API",
        Version:    "1.0.0",
        OutputPath: "./docs/openapi.yaml",
    })
    testServer = httptest.NewServer(NewRouter())
    gswag.SetTestServer(testServer)
})

var _ = AfterSuite(func() {
    testServer.Close()
    Expect(gswag.WriteSpec()).To(Succeed())
})
```

```go
// users_test.go
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
    })
})
```

Run `go test ./...` and `./docs/openapi.yaml` is written. The spec only contains operations that were actually tested.

### Option B: from Go code with spec

If you prefer build-time generation without running tests:

```go
// cmd/generate/main.go
func main() {
    r := spec.NewRouter(
        option.WithTitle("My API"),
        option.WithVersion("1.0.0"),
    )

    r.Get("/users/{id}",
        option.Summary("Get user by ID"),
        option.Tags("users"),
        option.Request(new(GetUserRequest)),
        option.Response(200, new(User)),
    )

    if err := r.WriteSchemaTo("./docs/openapi.yaml"); err != nil {
        log.Fatal(err)
    }
}
```

Run `go run ./cmd/generate` to regenerate the spec. This approach suits projects that don't use Ginkgo or need the spec available before tests run.

## Step 2 — Embed the spec in your binary

Use Go's `embed` package so the spec ships inside the binary — no external file dependencies at runtime:

```go
//go:embed docs/openapi.yaml
var specFS embed.FS
```

## Step 3 — Serve with spec-ui

Wire the embedded spec to a UI provider. Here is Swagger UI:

```go
import (
    "embed"
    "net/http"

    specui "github.com/oaswrap/spec-ui"
    "github.com/oaswrap/spec-ui/swaggerui"
)

//go:embed docs/openapi.yaml
var specFS embed.FS

func main() {
    handler := specui.NewHandler(
        specui.WithSpecEmbedFS("docs/openapi.yaml", specFS),
        swaggerui.WithUI(),
    )

    mux := http.NewServeMux()
    mux.Handle("/docs/", handler)
    mux.Handle("/", apiHandler())

    http.ListenAndServe(":8080", mux)
}
```

Switch to a different UI by changing the import — the rest of the code is identical:

```go
import "github.com/oaswrap/spec-ui/scalar"     // Scalar
import "github.com/oaswrap/spec-ui/redoc"       // ReDoc
import "github.com/oaswrap/spec-ui/rapidoc"     // RapiDoc
import "github.com/oaswrap/spec-ui/stoplight"   // Stoplight Elements
```

## Putting it together in CI

A typical GitHub Actions workflow for the gswag path:

```yaml
jobs:
  test-and-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.24'

      - name: Run tests and generate spec
        run: go test ./...
        # writes ./docs/openapi.yaml as a side-effect

      - name: Build binary (spec embedded)
        run: go build -o bin/api ./cmd/api

      - name: Upload spec artifact
        uses: actions/upload-artifact@v4
        with:
          name: openapi-spec
          path: docs/openapi.yaml
```

For the `spec` path, replace the test step with `go run ./cmd/generate`.

## The full picture

```
┌─────────────────────────────────────────┐
│              Source code                │
└──────────┬───────────────┬──────────────┘
           │               │
    go test ./...    go run ./cmd/generate
    (gswag path)     (spec path)
           │               │
           └───────┬───────┘
                   │
           docs/openapi.yaml
                   │
           ┌───────▼───────┐
           │  embed.FS     │
           └───────┬───────┘
                   │
           ┌───────▼───────┐
           │   spec-ui     │  GET /docs/
           │  (any router) │
           └───────────────┘
```

Each layer has a single responsibility. Swap the spec source, the UI provider, or the HTTP router independently — none of them are coupled to each other.

## Further reading

- [gswag documentation](/docs/gswag/introduction)
- [spec documentation](/docs/spec/introduction)
- [spec-ui documentation](/docs/spec-ui/introduction)
- [Test-Driven API Documentation with gswag and Ginkgo](/blog/test-driven-api-docs-gswag)
