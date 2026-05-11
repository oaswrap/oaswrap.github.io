---
sidebar_position: 2
---

# Installation

## Requirements

- Go 1.22 or later

## Install

```bash
go get github.com/oaswrap/spec
```

## Install a Framework Adapter

If you want automatic integration with your web framework, install the corresponding adapter module:

| Framework | Module |
|-----------|--------|
| **Chi** | `go get github.com/oaswrap/spec/adapter/chiopenapi` |
| **Echo v4** | `go get github.com/oaswrap/spec/adapter/echoopenapi` |
| **Echo v5** | `go get github.com/oaswrap/spec/adapter/echov5openapi` |
| **Gin** | `go get github.com/oaswrap/spec/adapter/ginopenapi` |
| **Fiber v2** | `go get github.com/oaswrap/spec/adapter/fiberopenapi` |
| **Fiber v3** | `go get github.com/oaswrap/spec/adapter/fiberv3openapi` |
| **Iris** | `go get github.com/oaswrap/spec/adapter/irisopenapi` |
| **net/http** | `go get github.com/oaswrap/spec/adapter/httpopenapi` |
| **Gorilla Mux** | `go get github.com/oaswrap/spec/adapter/muxopenapi` |

Each adapter is a separate Go module so you only pull in what you need.
