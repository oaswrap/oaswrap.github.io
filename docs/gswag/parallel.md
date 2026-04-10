---
sidebar_position: 8
---

# Parallel Ginkgo Support

When you run a Ginkgo suite with `ginkgo -p`, Ginkgo spawns multiple OS processes, each running a subset of your specs. Because gswag's global state lives in each process independently, parallel execution is safe by design — there are no cross-process data races.

Each process writes a **partial spec** file. Process 1 then merges all partial files into the final spec once every other process has finished.

## Option A — helper (recommended)

`RegisterParallelSuiteHandlers` handles everything internally using Ginkgo's `SynchronizedAfterSuite`, which guarantees that node 1 only merges after all other nodes have written their partial files:

```go
func TestAPI(t *testing.T) {
    gswag.RegisterParallelSuiteHandlers(&gswag.Config{
        Title:      "My API",
        Version:    "1.0.0",
        OutputPath: "./docs/openapi.yaml",
    }, httptest.NewServer(NewRouter()), "./tmp/gswag")
    RegisterFailHandler(Fail)
    RunSpecs(t, "API Suite")
}
```

The third argument is the **partial directory** — a temporary directory shared by all nodes. gswag creates it automatically if it does not exist.

## Option B — manual SynchronizedAfterSuite

For more control, wire the parallel lifecycle manually:

```go
var _ = SynchronizedAfterSuite(func() {
    // Runs on every node — write this node's partial spec.
    Expect(gswag.WritePartialSpec(GinkgoParallelProcess(), "./tmp/gswag")).To(Succeed())
}, func() {
    // Runs only on node 1, after all other nodes finish above.
    suiteCfg, _ := GinkgoConfiguration()
    Expect(gswag.MergeAndWriteSpec(suiteCfg.ParallelTotal, "./tmp/gswag")).To(Succeed())
})
```

## How merging works

Partial files are written as `./tmp/gswag/node-N.json`. `MergeAndWriteSpec` polls for each file using a configurable timeout (`Config.MergeTimeout`, default 30 s) to tolerate slow nodes.

The merge strategy is **last-write-loses, no-clobber**:

- **Paths** — operations are added for methods not already present in the merged spec. If the same path and method exists in multiple partials, the first one wins.
- **Components** (schemas, security schemes, responses, parameters, request bodies, headers, examples, links, callbacks) — first-seen wins.

## Adjust the merge timeout

If your nodes are slow to write partial files (large response bodies, slow disks), increase the timeout:

```go
Init(&Config{
    Title:        "My API",
    Version:      "1.0.0",
    MergeTimeout: 2 * time.Minute,
})
```

## Run in parallel

```bash
ginkgo -p ./...
# or
ginkgo --procs=4 ./...
```
