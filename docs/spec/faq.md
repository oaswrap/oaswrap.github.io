---
sidebar_position: 9
---

# FAQ

**Q: Can I use this with my existing API?**

Yes. Use the standalone version to document existing APIs without changing your routing code. Generate the spec file at build time, or gradually migrate to a framework adapter.

---

**Q: How does this compare to swag/swaggo?**

swag uses code comments (annotations) to define the spec. oaswrap uses pure Go code for type safety and better IDE support — autocompletion, refactoring, and compile-time errors instead of runtime parse failures.

---

**Q: How does this compare to Huma?**

- **Huma** is a complete HTTP framework with built-in OpenAPI generation, request/response validation, and middleware
- **oaswrap/spec** is a lightweight, framework-agnostic documentation builder that works with your existing setup

Use Huma if you're building a new API and want an all-in-one solution with automatic validation. Use oaswrap if you have existing code, prefer framework flexibility, or need standalone spec generation.

---

**Q: Is this production ready?**

The library is in active development. Core functionality is solid, but consider it **beta software**. Thorough testing is recommended before production use.

---

**Q: How do I handle authentication in the generated docs?**

Define security schemes using `option.WithSecurity()` when creating the router, then apply them to routes with `option.Security()`. See the [Security](/docs/spec/security) page for examples.

---

**Q: Does it support OpenAPI 3.1?**

Yes. Set `option.WithOpenAPIVersion("3.1.0")` when creating the router.

---

**Q: Can I use generics in my request/response models?**

Yes. Generic types like `APIResponse[User]` are fully supported. See the [Advanced](/docs/spec/advanced) page for examples.

---

**Q: How do I hide internal routes from the generated spec?**

Use `option.Hidden()` on individual routes or `option.GroupHidden()` on a group:

```go
internalGroup := r.Group("/internal", option.GroupHidden())
internalGroup.Get("/health", option.Summary("Health check")) // hidden
```
