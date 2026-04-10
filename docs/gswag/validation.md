---
sidebar_position: 7
---

# Validation

gswag can validate the generated spec for structural correctness and JSON Schema compliance against the OpenAPI 3.0 meta-schema.

## Validate the in-memory spec

```go
issues := gswag.ValidateSpec()
for _, issue := range issues {
    fmt.Println(issue.String()) // includes severity and message
}
```

`ValidationIssue` carries a severity — `"error"` or `"warning"`. Errors indicate spec invalidity; warnings indicate style or completeness issues.

## Validate a spec file on disk

```go
issues, err := gswag.ValidateSpecFile("./docs/openapi.yaml")
if err != nil {
    log.Fatal(err)
}
for _, issue := range issues {
    fmt.Println(issue.String())
}
```

## Write and validate in one step

```go
if err := gswag.WriteAndValidateSpec(); err != nil {
    // err wraps ErrSpecInvalid when any error-level issue exists
    log.Fatal(err)
}
```

Use this in `AfterSuite` instead of `WriteSpec` when you want the test suite to fail on an invalid spec:

```go
var _ = AfterSuite(func() {
    testServer.Close()
    Expect(gswag.WriteAndValidateSpec()).To(Succeed())
})
```

## Validation checks

### Errors (block spec output)

| Check | Description |
|-------|-------------|
| `info.title` present | Required by the OpenAPI spec |
| `info.version` present | Required by the OpenAPI spec |
| Security scheme references resolve | Every `BearerAuth()` / `Security("name")` call must match a scheme declared in `Config.SecuritySchemes` |
| JSON Schema validity | The serialised spec is validated against the OpenAPI 3.0 JSON meta-schema |

### Warnings (reported, not blocking)

| Check | Description |
|-------|-------------|
| Empty paths | A `paths` object with no operations |
| Operations missing `summary` | Operations should have a human-readable summary |
| Operations missing `tags` | Untagged operations may not group correctly in UI tools |

## Runtime response validation

Enable response validation during test execution to assert that real responses conform to the declared schema:

```go
Init(&Config{
    Title:                     "My API",
    Version:                   "1.0.0",
    EnforceResponseValidation: true,
    ValidationMode:            "warn", // "fail" (default) or "warn"
})
```

`ValidationMode: "fail"` causes a test failure when a response does not match its declared schema. `"warn"` logs the mismatch without failing.
