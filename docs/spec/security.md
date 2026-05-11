---
sidebar_position: 7
---

# Security

Define security schemes at the router level and apply them to routes or groups.

## Defining Security Schemes

```go
import "github.com/oaswrap/spec/openapi"

r := spec.NewRouter(
    option.WithTitle("My API"),
    option.WithVersion("1.0.0"),

    option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("bearer")),
    option.WithSecurity("basicAuth", option.SecurityHTTPBearer("basic")),
    option.WithSecurity("apiKey", option.SecurityAPIKey("X-API-Key", openapi.SecuritySchemeAPIKeyInHeader)),
    option.WithSecurity("mtls", option.SecurityMutualTLS()),
    option.WithSecurity("oidc", option.SecurityOpenIDConnect("https://auth.example.com/.well-known/openid-configuration")),

    option.WithSecurity("oauth2", option.SecurityOAuth2AuthorizationCode(
        "https://auth.example.com/oauth/authorize",
        "https://auth.example.com/oauth/token",
        map[string]string{
            "read:users":  "Read user data",
            "write:users": "Write user data",
        },
    )),
)
```

## Applying Security to Routes

```go
r.Get("/users/{id}",
    option.Summary("Get user by ID"),
    option.Security("bearerAuth"),
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
)
```

## Applying Security to Groups

```go
protected := r.Group("/api",
    option.GroupSecurity("bearerAuth"),
)
protected.Get("/profile", option.Summary("Get profile"))
protected.Put("/profile", option.Summary("Update profile"))
```

## Multiple Security Schemes

Multiple `option.Security(...)` entries are treated as alternatives (OR logic in OpenAPI):

```go
r.Get("/data",
    option.Security("bearerAuth"),
    option.Security("apiKey"),
)
```

## Security Options Reference

| Option | Description |
|--------|-------------|
| `SecurityHTTPBearer(scheme, bearerFormat...)` | HTTP auth schemes such as `bearer` and `basic` |
| `SecurityAPIKey(name, in)` | API key auth (`header`, `query`, `cookie`) |
| `SecurityOAuth2(flows)` | OAuth2 security with explicit flows |
| `SecurityOAuth2Implicit(...)` | OAuth2 implicit flow helper |
| `SecurityOAuth2Password(...)` | OAuth2 password flow helper |
| `SecurityOAuth2ClientCredentials(...)` | OAuth2 client credentials flow helper |
| `SecurityOAuth2AuthorizationCode(...)` | OAuth2 authorization code flow helper |
| `SecurityOAuth2DeviceAuthorization(...)` | OAuth2 device authorization flow helper (OpenAPI 3.2) |
| `SecurityOpenIDConnect(url)` | OpenID Connect scheme |
| `SecurityMutualTLS()` | Mutual TLS scheme |

## Registering Raw Security Scheme Components

For advanced cases where the helper functions don't cover your scheme configuration, use `WithComponentSecurityScheme` to register an `*openapi.SecurityScheme` directly:

```go
r := spec.NewRouter(
    option.WithComponentSecurityScheme("cookieAuth", &openapi.SecurityScheme{
        Type: "apiKey",
        In:   "cookie",
        Name: "session_id",
    }),
)
```

Then reference the scheme by name in operations:

```go
r.Get("/profile", option.Security("cookieAuth"))
```
