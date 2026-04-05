---
sidebar_position: 1
---

# Introduction

`oaswrap/spec-ui` is a Go library that provides multiple OpenAPI documentation UIs as standard HTTP handlers. Serve beautiful, interactive API documentation for any OpenAPI specification.

## Features

- **Multiple UI Options** — Swagger UI, Stoplight Elements, ReDoc, Scalar, and RapiDoc
- **Easy Integration** — Simple HTTP handler integration with Go's standard library
- **Customizable** — Configure titles, base paths, and OpenAPI spec locations
- **Flexible** — Works with any Go HTTP router or framework
- **Embedded Assets** — Optional self-contained binaries for air-gapped environments

## Architecture

spec-ui uses a **provider-based architecture** for maximum flexibility:

- Each UI provider lives in its own package (e.g., `swaggerui`, `stoplight`, `redoc`)
- Import the provider package and call `WithUI()` to select it
- Only the selected provider's code is linked into the binary — unused providers are tree-shaken by the Go linker
- Each provider has a `*emb` variant (e.g., `swaggeruiemb`) for embedded asset mode

### How It Works

1. Call `specui.NewHandler(opts...)` with functional options and a provider `WithUI()` option
2. Options populate an internal `config.SpecUI` struct
3. `handler.Docs()` lazily creates the UI handler for the selected provider
4. `handler.Spec()` serves the raw OpenAPI spec file (from file path, `embed.FS`, `fs.FS`, or a runtime generator)
5. `handler.Assets()` serves embedded assets (only in `*emb` mode; `nil` in CDN mode)

## CDN Mode vs Embedded Mode

By default, UI CSS and JavaScript are loaded from CDN. This keeps your binary small.

For **offline or air-gapped deployments**, use the `*emb` variant packages — they bundle all assets into the binary:

| Provider | CDN Package | Embedded Package |
|----------|-------------|------------------|
| Swagger UI | `swaggerui` | `swaggeruiemb` |
| Stoplight Elements | `stoplight` | `stoplightemb` |
| ReDoc | `redoc` | `redocemb` |
| Scalar | `scalar` | `scalaremb` |
| RapiDoc | `rapidoc` | `rapidocemb` |
