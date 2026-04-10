---
sidebar_position: 5
---

# Configuration

Pass a `*Config` to `Init` in your `BeforeSuite` (or to `RegisterSuiteHandlers`).

## Full reference

```go
Init(&Config{
    // API info (required)
    Title:          "My API",
    Version:        "1.0.0",
    Description:    "Public REST API",
    TermsOfService: "https://example.com/terms",

    Contact: &ContactConfig{
        Name:  "API Team",
        URL:   "https://example.com/support",
        Email: "api@example.com",
    },

    License: &LicenseConfig{
        Name: "Apache 2.0",
        URL:  "https://www.apache.org/licenses/LICENSE-2.0.html",
    },

    ExternalDocs: &ExternalDocsConfig{
        Description: "Full documentation",
        URL:         "https://docs.example.com",
    },

    // Tags shown at the top of the spec
    Tags: []TagConfig{
        {Name: "users",  Description: "User management"},
        {Name: "orders", Description: "Order operations"},
    },

    // Output
    OutputPath:   "./docs/openapi.yaml", // default: ./docs/openapi.yaml
    OutputFormat: YAML,                  // YAML (default) or JSON

    // Servers
    Servers: []ServerConfig{
        {URL: "https://api.example.com",         Description: "Production"},
        {URL: "https://staging.api.example.com", Description: "Staging"},
    },

    // Exclude paths from the spec (tests still run)
    ExcludePaths: []string{
        "/internal/*",
        "/admin/health",
    },

    // Security schemes
    SecuritySchemes: map[string]SecuritySchemeConfig{
        "bearerAuth":  BearerJWT(),
        "apiKey":      APIKeyHeader("X-API-Key"),
        "apiKeyQuery": APIKeyQuery("api_key"),
        "oauth2": OAuth2Implicit("https://example.com/oauth/authorize", map[string]string{
            "read:users":  "read users",
            "write:users": "modify users",
        }),
    },

    // Response validation
    EnforceResponseValidation: true,
    ValidationMode:            "warn", // "fail" (default) or "warn"

    // Example capture from real responses
    CaptureExamples: true,
    MaxExampleBytes: 0, // 0 → default cap of 16 384 bytes; set > 0 to override
    Sanitizer: func(b []byte) []byte {
        // redact sensitive fields before attaching to the spec
        return b
    },

    // Parallel merge timeout (default: 30s)
    MergeTimeout: 60 * time.Second,
})
```

## Fields

### API info

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Title` | `string` | Yes | API title |
| `Version` | `string` | Yes | API version (e.g. `"1.0.0"`) |
| `Description` | `string` | | Human-readable description |
| `TermsOfService` | `string` | | URL to terms of service |
| `Contact` | `*ContactConfig` | | Contact information |
| `License` | `*LicenseConfig` | | License name and URL |
| `ExternalDocs` | `*ExternalDocsConfig` | | Link to external documentation |

### Output

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `OutputPath` | `string` | `./docs/openapi.yaml` | File path for `WriteSpec()` |
| `OutputFormat` | `OutputFormat` | `YAML` | `YAML` or `JSON` |

### Paths and security

| Field | Type | Description |
|-------|------|-------------|
| `Servers` | `[]ServerConfig` | Server URLs listed in the spec |
| `Tags` | `[]TagConfig` | Global tag definitions |
| `ExcludePaths` | `[]string` | Paths omitted from spec generation (tests still run). Supports exact matches and `*` prefix wildcards, e.g. `"/internal/*"` |
| `SecuritySchemes` | `map[string]SecuritySchemeConfig` | Named security schemes |

### Validation

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `EnforceResponseValidation` | `bool` | `false` | Validate responses against the spec during tests |
| `ValidationMode` | `string` | `"fail"` | `"fail"` to error on violations, `"warn"` to log only |

### Example capture

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `CaptureExamples` | `bool` | `false` | Attach real request/response bodies as OpenAPI examples |
| `MaxExampleBytes` | `int` | `0` (= 16 384) | Maximum size of a captured example body |
| `Sanitizer` | `func([]byte) []byte` | `nil` | Transform body bytes before attaching (use to redact secrets) |

### Parallel

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `MergeTimeout` | `time.Duration` | `30s` | How long `MergeAndWriteSpec` waits for slow nodes to write partial files |

## Security scheme helpers

| Helper | Produces |
|--------|----------|
| `BearerJWT()` | HTTP Bearer scheme (`Authorization: Bearer <token>`) |
| `APIKeyHeader(name)` | API key in request header |
| `APIKeyQuery(name)` | API key as query parameter |
| `APIKeyCookie(name)` | API key in cookie |
| `OAuth2Implicit(authURL, scopes)` | OAuth2 implicit flow |
