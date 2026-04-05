---
sidebar_position: 4
---

# Configuration

The `option` package provides all configuration options for the OpenAPI specification. Pass options to `spec.NewRouter()` or `spec.NewGenerator()`.

## Basic Information

```go
import "github.com/oaswrap/spec/option"

r := spec.NewRouter(
    option.WithOpenAPIVersion("3.0.3"), // Default: "3.0.3"
    option.WithTitle("My API"),
    option.WithDescription("A comprehensive API for my application"),
    option.WithVersion("1.2.3"),
)
```

## Contact and License

```go
import "github.com/swaggest/openapi-go/openapi3"

r := spec.NewRouter(
    option.WithContact(openapi3.Contact{
        Name:  "Support Team",
        URL:   "https://support.example.com",
        Email: "support@example.com",
    }),
    option.WithLicense(openapi3.License{
        Name: "MIT License",
        URL:  "https://opensource.org/licenses/MIT",
    }),
    option.WithExternalDocs("https://docs.example.com", "Full Documentation"),
)
```

## Tags

Tags group operations in the generated documentation:

```go
r := spec.NewRouter(
    option.WithTags(
        openapi3.Tag{
            Name:        "User Management",
            Description: "Operations related to user management",
        },
        openapi3.Tag{
            Name:        "Authentication",
            Description: "Authentication related operations",
        },
    ),
)
```

## Servers

```go
// Simple server
option.WithServer("https://api.example.com")

// Server with description
option.WithServer("https://api.example.com",
    option.ServerDescription("Production Server"),
)

// Server with variables
option.WithServer("https://api.example.com/{version}",
    option.ServerDescription("Versioned Server"),
    option.ServerVariables(map[string]openapi3.ServerVariable{
        "version": {
            Default:     "v1",
            Enum:        []string{"v1", "v2"},
            Description: "API version",
        },
    }),
)
```

## Security Schemes

Define security schemes at the router level, then apply them to routes or groups.

```go
// Bearer token (JWT)
option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("Bearer"))

// API Key in header
option.WithSecurity("apiKey", option.SecurityAPIKey("X-API-Key", "header"))

// API Key in query parameter
option.WithSecurity("apiKeyQuery", option.SecurityAPIKey("api_key", "query"))

// OAuth2
option.WithSecurity("oauth2", option.SecurityOAuth2(
    openapi3.OAuthFlows{
        Implicit: &openapi3.OAuthFlowsImplicit{
            AuthorizationURL: "https://auth.example.com/authorize",
            Scopes: map[string]string{
                "read":  "Read access",
                "write": "Write access",
            },
        },
    },
))
```

## All OpenAPI Options

| Option | Description |
|--------|-------------|
| `WithOpenAPIVersion(v)` | Set OpenAPI version (default: `"3.0.3"`) |
| `WithTitle(t)` | Set API title |
| `WithDescription(d)` | Set API description |
| `WithVersion(v)` | Set API version |
| `WithContact(c)` | Set contact information |
| `WithLicense(l)` | Set license information |
| `WithExternalDocs(url, desc)` | Set external documentation link |
| `WithTags(...tags)` | Define global tags |
| `WithServer(url, ...opts)` | Add a server |
| `WithSecurity(name, opt)` | Define a security scheme |
