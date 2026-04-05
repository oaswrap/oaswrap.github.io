---
sidebar_position: 1
---

# Introduction

`oaswrap/spec` is a lightweight, framework-agnostic OpenAPI 3.x specification builder for Go that gives you complete control over your API documentation without vendor lock-in.

## Why oaswrap/spec?

- **Framework Agnostic** — Works with any Go web framework or as a standalone tool
- **Zero Dependencies** — Powered by [`swaggest/openapi-go`](https://github.com/swaggest/openapi-go) with minimal overhead
- **Programmatic Control** — Build specs in pure Go code with full type safety
- **Adapter Ecosystem** — Seamless integration with popular frameworks via dedicated adapters
- **CI/CD Ready** — Generate specs at build time for documentation pipelines

## When to Use

### Use `spec` for static generation when you:
- Generate OpenAPI files at **build time**
- Integrate with **CI/CD pipelines**
- Build **custom documentation tools**
- Need **static spec generation** from existing code

### Use framework adapters when you:
- Want **automatic spec generation** from routes
- Need **zero-configuration setup**
- Prefer **inline OpenAPI configuration** alongside route definitions
- Want **route registration + documentation** in one step

## Comparison

| | oaswrap/spec | swag/swaggo | Huma |
|---|---|---|---|
| **Style** | Code-first | Annotation-based | Framework + validation |
| **Type Safety** | Full | Limited | Full |
| **Framework** | Any / Agnostic | Any | Built-in |
| **Standalone** | Yes | Yes | No |
| **Validation** | Spec only | Spec only | Request/Response |

**vs swag/swaggo**: oaswrap uses pure Go code for type safety and better IDE support. swag uses code comments and annotations.

**vs Huma**: Huma is a complete HTTP framework with built-in OpenAPI generation, validation, and middleware. oaswrap/spec is a lightweight documentation builder — use it if you have existing code, prefer framework flexibility, or need standalone spec generation.

## Status

The library is in active development. While core functionality is solid, consider it **beta software**. Thorough testing is recommended before production use.
