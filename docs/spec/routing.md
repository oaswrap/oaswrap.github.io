---
sidebar_position: 5
---

# Routing

The `spec.Router` interface provides methods for registering routes and organizing them into groups.

## HTTP Methods

Register routes with standard HTTP methods:

```go
r := spec.NewRouter(option.WithTitle("My API"), option.WithVersion("1.0.0"))

r.Get("/users", option.Summary("List users"))
r.Post("/users", option.Summary("Create user"))
r.Put("/users/{id}", option.Summary("Update user"))
r.Patch("/users/{id}", option.Summary("Partially update user"))
r.Delete("/users/{id}", option.Summary("Delete user"))
r.Head("/users", option.Summary("Check users endpoint"))
r.Options("/users", option.Summary("Options for users"))
r.Trace("/users", option.Summary("Trace users"))

// Custom method
r.Add("PURGE", "/cache/{key}", option.Summary("Purge cache key"))
```

## Operation Options

Each route accepts operation options:

```go
r.Get("/users/{id}",
    option.OperationID("getUserByID"),
    option.Summary("Get user by ID"),
    option.Description("Retrieves a specific user by their unique identifier."),
    option.Tags("User Management"),
    option.Request(new(GetUserRequest)),
    option.Response(200, new(User)),
    option.Response(404, new(ErrorResponse)),
    option.Security("bearerAuth"),
    option.Deprecated(),
)
```

## Groups

Groups allow you to apply common settings to multiple routes. Groups are nestable.

```go
// Group with path prefix
v1 := r.Group("/api/v1")
v1.Get("/users", option.Summary("List users"))
v1.Post("/users", option.Summary("Create user"))

// Nested groups
api := r.Group("/api")
v1 := api.Group("/v1")
v1.Get("/users", option.Summary("List users"))
```

## Group Options

Apply settings to all routes within a group:

```go
// Apply tags to all routes in the group
adminGroup := r.Group("/admin",
    option.GroupTags("Administration"),
    option.GroupSecurity("bearerAuth"),
)
adminGroup.Get("/users", option.Summary("Admin: list users"))
adminGroup.Delete("/users/{id}", option.Summary("Admin: delete user"))

// Mark all routes in a group as deprecated
legacyGroup := r.Group("/api/v0",
    option.GroupDeprecated(),
    option.GroupTags("Legacy"),
)

// Hide internal routes from the spec entirely
internalGroup := r.Group("/internal",
    option.GroupHidden(),
)
internalGroup.Get("/health", option.Summary("Health check"))  // hidden from spec
```

## With (Inline Middleware-Style Groups)

Use `With()` to create a group at the same path with different options:

```go
// All routes registered via this router require bearerAuth
authenticated := r.With(option.GroupSecurity("bearerAuth"))
authenticated.Get("/profile", option.Summary("Get current user profile"))
authenticated.Put("/profile", option.Summary("Update current user profile"))
```

## Route Interface

You can also build routes incrementally:

```go
route := r.NewRoute()
route.Method("GET").Path("/users/{id}").With(
    option.Summary("Get user"),
    option.Response(200, new(User)),
)
```

## Group Options Reference

| Option | Description |
|--------|-------------|
| `GroupTags(...tags)` | Apply tags to all routes in the group |
| `GroupSecurity(...names)` | Apply security schemes to all routes |
| `GroupDeprecated()` | Mark all routes as deprecated |
| `GroupHidden()` | Exclude all routes from the spec |
