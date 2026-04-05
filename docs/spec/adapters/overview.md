---
sidebar_position: 1
---

# Adapters Overview

Framework adapters provide seamless integration with popular Go web frameworks. Each adapter:

- Automatically generates an OpenAPI spec from your route definitions
- Serves interactive documentation UI at `/docs`
- Serves the OpenAPI YAML spec at `/docs/openapi.yaml`
- Supports inline OpenAPI options alongside route handlers

## Available Adapters

| Framework | Adapter Module | Description |
|-----------|---------------|-------------|
| [Chi](/docs/spec/adapters/chi) | `github.com/oaswrap/spec/adapter/chiopenapi` | Lightweight router with middleware support |
| [Echo v4](/docs/spec/adapters/echo) | `github.com/oaswrap/spec/adapter/echoopenapi` | High performance, extensible, minimalist framework |
| [Echo v5](/docs/spec/adapters/echo) | `github.com/oaswrap/spec/adapter/echov5openapi` | Echo v5 with updated Context API |
| [Gin](/docs/spec/adapters/gin) | `github.com/oaswrap/spec/adapter/ginopenapi` | Fast HTTP web framework with zero allocation router |
| [Fiber v2](/docs/spec/adapters/fiber) | `github.com/oaswrap/spec/adapter/fiberopenapi` | Express-inspired framework built on Fasthttp |
| [Fiber v3](/docs/spec/adapters/fiber) | `github.com/oaswrap/spec/adapter/fiberv3openapi` | Fiber v3 with updated Ctx interface and binding API |
| [net/http](/docs/spec/adapters/http) | `github.com/oaswrap/spec/adapter/httpopenapi` | Go standard library HTTP package |
| [HTTPRouter](/docs/spec/adapters/mux) | `github.com/oaswrap/spec/adapter/httprouteropenapi` | High performance HTTP request router |
| [Gorilla Mux](/docs/spec/adapters/mux) | `github.com/oaswrap/spec/adapter/muxopenapi` | Powerful HTTP router and URL matcher |

## How Adapters Work

Each adapter wraps both your framework's router and `spec.Generator`:

1. `NewRouter(frameworkRouter, opts...)` returns the adapter's `Generator` interface
2. Route methods (`.Get()`, `.Post()`, etc.) register handlers on **both** the framework router and the spec generator
3. The docs UI (`/docs`) and YAML spec (`/docs/openapi.yaml`) routes are added automatically
4. Path parameter styles are converted — e.g., `:id` → `{id}` for OpenAPI

## Disable Automatic Docs

If you want to manage the docs routes yourself:

```go
api := chiopenapi.NewRouter(r,
    option.WithTitle("My API"),
    option.DisableDocs(),
)
```

## Default Adapter Settings

All adapters come with sensible defaults:
- Title: "API Documentation"
- OpenAPI version: 3.0.3
- Docs path: `/docs`
- Spec path: `/docs/openapi.yaml`
- UI provider: Stoplight Elements
