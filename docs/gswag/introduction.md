---
sidebar_position: 1
---

# Introduction

`oaswrap/gswag` generates OpenAPI 3.0 specifications as a side-effect of running [Ginkgo v2](https://github.com/onsi/ginkgo) integration tests. Instead of writing annotations or maintaining a separate spec file, you describe your API using a nested DSL alongside real, executable tests. The spec is written to disk automatically when the test suite finishes.

Inspired by [rswag](https://github.com/rswag/rswag) for Ruby on Rails.

## How it works

`gswag` operates in three phases:

1. **Tree construction** — DSL calls (`Path`, `Get`, `Response`, …) run synchronously as Ginkgo evaluates your test files. They record operation metadata — path, method, parameters, schemas, security — into an in-memory operation tree.
2. **Test execution** — `RunTest` fires a real HTTP request against your `httptest.Server`. Responses are asserted with Gomega matchers, and schemas/examples are inferred from the actual request and response bodies.
3. **Output** — `WriteSpec()` (called in `AfterSuite`) serialises the accumulated OpenAPI document to YAML or JSON.

Because tests execute against a real server, the spec stays in sync with your handler behaviour by construction.

## Why gswag?

- **No annotations** — specs emerge from test behaviour, not struct tags or code comments
- **Live HTTP requests** — tests prove the API works; gswag captures the proof as documentation
- **Ginkgo-native** — integrates directly with Ginkgo's `Describe`/`It` lifecycle and parallel process model
- **Example capture** — real request/response bodies can be attached to the spec as examples
- **Validation built-in** — structural and JSON-Schema-level validation of the generated spec

## When to use gswag

Use `gswag` when you:

- Already use Ginkgo for integration tests and want your spec to come for free
- Want the spec to reflect what your API **actually does**, not what you think it does
- Need response examples captured from real responses
- Run parallel Ginkgo suites and need per-node spec merging

Use [`oaswrap/spec`](/docs/spec/introduction) instead when you:

- Prefer code-first, build-time spec generation without running tests
- Do not use Ginkgo
- Want framework adapters that register routes and docs simultaneously

## Comparison

| | gswag | oaswrap/spec | swag/swaggo |
|---|---|---|---|
| **Style** | Test-driven | Code-first | Annotation-based |
| **Spec source** | Real HTTP responses | Go types | Code comments |
| **Framework** | Any (httptest) | Any / Agnostic | Any |
| **Example capture** | Yes (live) | No | No |
| **Test required** | Yes (Ginkgo) | No | No |
| **Parallel support** | Yes (ginkgo -p) | N/A | N/A |

## Status

The library is in active development. While core functionality is solid, consider it **beta software**. Thorough testing is recommended before production use.
