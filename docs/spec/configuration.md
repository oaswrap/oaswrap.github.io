---
sidebar_position: 4
---

# Configuration

The `option` package provides root OpenAPI options for `spec.NewRouter()` and `spec.NewGenerator()`.

## Basic Information

```go
import (
    "github.com/oaswrap/spec"
    "github.com/oaswrap/spec/openapi"
    "github.com/oaswrap/spec/option"
)

r := spec.NewRouter(
    option.WithOpenAPIVersion(openapi.Version312), // default: openapi.Version312
    option.WithTitle("My API"),
    option.WithInfoSummary("Public API"),
    option.WithDescription("A comprehensive API for my application"),
    option.WithVersion("1.2.3"),
)
```

## Contact, License, and External Docs

```go
r := spec.NewRouter(
    option.WithContact(openapi.Contact{
        Name:  "Support Team",
        URL:   "https://support.example.com",
        Email: "support@example.com",
    }),
    option.WithLicense(openapi.License{
        Name: "MIT License",
        URL:  "https://opensource.org/licenses/MIT",
    }),
    option.WithTermsOfService("https://example.com/terms"),
    option.WithExternalDocs("https://docs.example.com", "Full Documentation"),
)
```

## Tags

```go
r := spec.NewRouter(
    option.WithTag("users",
        option.TagSummary("Users"),
        option.TagDescription("User management operations"),
    ),
    option.WithTag("admin",
        option.TagDescription("Admin operations"),
        option.TagExternalDocs("https://example.com/admin-docs"),
    ),
)
```

Available tag options:

| Option | Description |
|--------|-------------|
| `TagSummary(s)` | Short summary for the tag |
| `TagDescription(s)` | Longer description |
| `TagExternalDocs(url, desc...)` | Link to external documentation |
| `TagParent(name)` | Set parent tag — OpenAPI 3.2 only |
| `TagKind(kind)` | Set tag kind — OpenAPI 3.2 only |

`TagParent` and `TagKind` are OpenAPI 3.2.0 extensions for organizing tags into hierarchies:

```go
r := spec.NewRouter(
    option.WithOpenAPIVersion(openapi.Version320),
    option.WithTag("users",        option.TagKind("group")),
    option.WithTag("users.list",   option.TagParent("users"), option.TagDescription("List users")),
    option.WithTag("users.create", option.TagParent("users"), option.TagDescription("Create user")),
)
```

## Servers

```go
option.WithServer("https://api.example.com")

option.WithServer("https://api.example.com/{version}",
    option.ServerDescription("Versioned Server"),
    option.ServerVariables(map[string]openapi.ServerVariable{
        "version": {
            Default:     "v1",
            Enum:        []string{"v1", "v2"},
            Description: "API version",
        },
    }),
)
```

## Security Schemes

```go
option.WithSecurity("bearerAuth", option.SecurityHTTPBearer("bearer"))
option.WithSecurity("apiKey", option.SecurityAPIKey("X-API-Key", openapi.SecuritySchemeAPIKeyInHeader))
option.WithSecurity("mtls", option.SecurityMutualTLS())
option.WithSecurity("oidc", option.SecurityOpenIDConnect("https://auth.example.com/.well-known/openid-configuration"))
option.WithSecurity("oauth2", option.SecurityOAuth2AuthorizationCode(
    "https://auth.example.com/oauth/authorize",
    "https://auth.example.com/oauth/token",
    map[string]string{"read": "Read access"},
))

// Optional global requirement
option.WithGlobalSecurity("bearerAuth")
```

## Path Handling

```go
// Remove trailing slashes from all operation paths in the spec.
// "/pet/" becomes "/pet", "/" is left unchanged.
option.WithStripTrailingSlash()
```

## All OpenAPI Options

| Option | Description |
|--------|-------------|
| `WithOpenAPIVersion(v)` | Set OpenAPI version (default: `openapi.Version312`) |
| `WithSelf(uri)` | Set OpenAPI 3.2 `$self` |
| `WithJSONSchemaDialect(uri)` | Set root `jsonSchemaDialect` |
| `WithTitle(t)` | Set `info.title` |
| `WithInfoSummary(s)` | Set `info.summary` |
| `WithDescription(d)` | Set `info.description` |
| `WithVersion(v)` | Set `info.version` |
| `WithContact(c)` | Set contact information |
| `WithLicense(l)` | Set license information |
| `WithTermsOfService(url)` | Set terms of service URL |
| `WithExternalDocs(url, desc...)` | Set external documentation |
| `WithTag(name, ...opts)` / `WithTags(...tags)` | Define global tags (`TagSummary`, `TagDescription`, `TagExternalDocs`, `TagParent`, `TagKind`) |
| `WithServer(url, ...opts)` | Add a server |
| `WithSecurity(name, ...opts)` | Define a reusable security scheme |
| `WithGlobalSecurity(name, scopes...)` | Add global security requirement |
| `WithReflectorConfig(...opts)` | Customize reflection behavior (see Advanced Features for reflector hooks and parameter tag mapping) |
| `WithStripTrailingSlash()` | Remove trailing slashes from operation paths |
| `WithPathParser(parser)` | Convert framework path syntax to OpenAPI path templates |
| `WithDocument(fn)` | Apply low-level document customization before serialization |
| `WithComponentSchema/Response/Parameter/...` | Register reusable components directly |
| `WithCacheAge(n)` | Set Cache-Control age for spec responses |
| `WithUIOption(opt)` | Set a custom spec-ui provider option |
| `WithDocsPath(path)` | Set adapter docs UI path |
| `WithSpecPath(path)` | Set adapter spec endpoint path |
| `WithDisableDocs()` | Disable adapter docs endpoints |
| `WithLogger(logger)` | Set a custom slog.Logger for internal debug logs (pass nil to use slog.Default()) |
| `WithDebugLogger()` | Enable debug-level logging to stderr (convenience helper) |
