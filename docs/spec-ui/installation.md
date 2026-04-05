---
sidebar_position: 2
---

# Installation

## Requirements

- Go 1.18 or later

## Install

```bash
go get github.com/oaswrap/spec-ui
```

The base package contains the handler and core options. UI providers are in subpackages — import the one you want:

```bash
# Swagger UI (CDN)
go get github.com/oaswrap/spec-ui/swaggerui

# Stoplight Elements (CDN)
go get github.com/oaswrap/spec-ui/stoplight

# ReDoc (CDN)
go get github.com/oaswrap/spec-ui/redoc

# Scalar (CDN)
go get github.com/oaswrap/spec-ui/scalar

# RapiDoc (CDN)
go get github.com/oaswrap/spec-ui/rapidoc
```

For embedded (offline) variants, use the `*emb` packages:

```bash
go get github.com/oaswrap/spec-ui/swaggeruiemb
go get github.com/oaswrap/spec-ui/stoplightemb
# etc.
```

Because each provider is a separate package, the Go linker tree-shakes unused providers — only the provider you import is included in the binary.
