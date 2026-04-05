---
sidebar_position: 7
---

# Security

Define security schemes at the router level and apply them to individual routes or groups.

## Defining Security Schemes

Security schemes are defined when creating the router using `option.WithSecurity()`:

```go
r := spec.NewRouter(
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),

    // Bearer token (e.g. JWT)
    option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("Bearer")),

    // API Key in header
    option.WithSecurity("apiKey", option.SecurityAPIKey("X-API-Key", "header")),

    // API Key in query
    option.WithSecurity("apiKeyQuery", option.SecurityAPIKey("api_key", "query")),

    // Basic auth
    option.WithSecurity("basicAuth", option.SecurityHTTPBearer("Basic")),
)
```

## OAuth2

```go
import "github.com/swaggest/openapi-go/openapi3"

option.WithSecurity("oauth2", option.SecurityOAuth2(
    openapi3.OAuthFlows{
        // Authorization Code flow
        AuthorizationCode: &openapi3.OAuthFlowsAuthorizationCode{
            AuthorizationURL: "https://auth.example.com/authorize",
            TokenURL:         "https://auth.example.com/token",
            Scopes: map[string]string{
                "read:users":  "Read user data",
                "write:users": "Write user data",
            },
        },
        // Implicit flow
        Implicit: &openapi3.OAuthFlowsImplicit{
            AuthorizationURL: "https://auth.example.com/authorize",
            Scopes: map[string]string{
                "read":  "Read access",
                "write": "Write access",
            },
        },
        // Client Credentials flow
        ClientCredentials: &openapi3.OAuthFlowsClientCredentials{
            TokenURL: "https://auth.example.com/token",
            Scopes: map[string]string{
                "admin": "Admin access",
            },
        },
    },
))
```

## Applying Security to Routes

Apply a defined security scheme to a specific route:

```go
r.Get("/users/{id}",
    option.Summary("Get user by ID"),
    option.Security("bearerAuth"),
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```

## Applying Security to Groups

Apply security to all routes in a group at once:

```go
// All routes in this group require bearerAuth
protected := r.Group("/api",
    option.GroupSecurity("bearerAuth"),
)
protected.Get("/profile", option.Summary("Get profile"))
protected.Put("/profile", option.Summary("Update profile"))

// Multiple security schemes on a group
adminGroup := r.Group("/admin",
    option.GroupSecurity("bearerAuth", "apiKey"),
)
```

## Multiple Security Schemes

When multiple security schemes are applied, the generated spec treats them as alternatives (OR logic — any one is sufficient):

```go
r.Get("/data",
    option.Security("bearerAuth"),
    option.Security("apiKey"),
)
```

## Security Options Reference

| Option | Description |
|--------|-------------|
| `SecurityHTTPBearer(scheme)` | HTTP bearer token (e.g., `"Bearer"` for JWT) |
| `SecurityAPIKey(name, in)` | API Key; `in` is `"header"`, `"query"`, or `"cookie"` |
| `SecurityOAuth2(flows)` | OAuth2 with one or more flows |
