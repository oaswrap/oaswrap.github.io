---
sidebar_position: 6
---

# Framework Integration

`spec-ui` works with any Go HTTP router. Here are examples for common frameworks.

## Chi

```go
package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/stoplight"
)

func main() {
	r := chi.NewRouter()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithDocsPath("/docs"),
		specui.WithSpecPath("/docs/openapi.yaml"),
		specui.WithSpecFile("openapi.yaml"),
		stoplight.WithUI(),
	)

	r.Get(handler.DocsPath(), handler.DocsFunc())
	r.Get(handler.SpecPath(), handler.SpecFunc())
	if handler.AssetsEnabled() {
		r.Handle(handler.AssetsPath()+"/*", handler.Assets())
	}

	log.Println("Docs at http://localhost:3000/docs")
	http.ListenAndServe(":3000", r)
}
```

## Echo

```go
package main

import (
	"log"

	"github.com/labstack/echo/v4"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/swaggerui"
)

func main() {
	e := echo.New()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithDocsPath("/docs"),
		specui.WithSpecPath("/docs/openapi.yaml"),
		specui.WithSpecFile("openapi.yaml"),
		swaggerui.WithUI(),
	)

	e.GET(handler.DocsPath(), echo.WrapHandler(handler.Docs()))
	e.GET(handler.SpecPath(), echo.WrapHandler(handler.Spec()))
	if handler.AssetsEnabled() {
		e.GET(handler.AssetsPath()+"/*", echo.WrapHandler(handler.Assets()))
	}

	log.Println("Docs at http://localhost:3000/docs")
	e.Logger.Fatal(e.Start(":3000"))
}
```

## Fiber

Fiber requires the `adaptor` middleware to wrap `http.Handler`:

```go
package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/scalar"
)

func main() {
	app := fiber.New()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithDocsPath("/docs"),
		specui.WithSpecPath("/docs/openapi.yaml"),
		specui.WithSpecFile("openapi.yaml"),
		scalar.WithUI(),
	)

	app.Get(handler.DocsPath(), adaptor.HTTPHandler(handler.Docs()))
	app.Get(handler.SpecPath(), adaptor.HTTPHandler(handler.Spec()))
	if handler.AssetsEnabled() {
		app.Get(handler.AssetsPath()+"/*", adaptor.HTTPHandler(handler.Assets()))
	}

	log.Fatal(app.Listen(":3000"))
}
```

## Gin

```go
package main

import (
	"github.com/gin-gonic/gin"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/rapidoc"
)

func main() {
	r := gin.Default()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithSpecFile("openapi.yaml"),
		rapidoc.WithUI(),
	)

	r.GET(handler.DocsPath(), gin.WrapH(handler.Docs()))
	r.GET(handler.SpecPath(), gin.WrapH(handler.Spec()))
	if handler.AssetsEnabled() {
		r.GET(handler.AssetsPath()+"/*filepath", gin.WrapH(handler.Assets()))
	}

	r.Run(":3000")
}
```

## net/http

```go
package main

import (
	"log"
	"net/http"

	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/rapidoc"
)

func main() {
	mux := http.NewServeMux()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithDocsPath("/docs"),
		specui.WithSpecPath("/docs/openapi.yaml"),
		specui.WithSpecFile("openapi.yaml"),
		rapidoc.WithUI(),
	)

	mux.Handle("GET "+handler.DocsPath(), handler.Docs())
	mux.Handle("GET "+handler.SpecPath(), handler.Spec())
	if handler.AssetsEnabled() {
		mux.Handle("GET "+handler.AssetsPath()+"/", handler.Assets())
	}

	log.Println("Docs at http://localhost:3000/docs")
	http.ListenAndServe(":3000", mux)
}
```

## Gorilla Mux

```go
package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	specui "github.com/oaswrap/spec-ui"
	"github.com/oaswrap/spec-ui/redoc"
)

func main() {
	r := mux.NewRouter()

	handler := specui.NewHandler(
		specui.WithTitle("My API"),
		specui.WithSpecFile("openapi.yaml"),
		redoc.WithUI(),
	)

	r.Handle(handler.DocsPath(), handler.Docs()).Methods("GET")
	r.Handle(handler.SpecPath(), handler.Spec()).Methods("GET")
	if handler.AssetsEnabled() {
		r.PathPrefix(handler.AssetsPath() + "/").Handler(handler.Assets()).Methods("GET")
	}

	log.Println("Docs at http://localhost:3000/docs")
	http.ListenAndServe(":3000", r)
}
```
