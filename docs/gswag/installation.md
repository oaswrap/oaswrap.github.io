---
sidebar_position: 2
---

# Installation

## Requirements

- Go 1.24 or later
- [Ginkgo v2](https://github.com/onsi/ginkgo) and [Gomega](https://github.com/onsi/gomega) in your test module

## Install

```bash
go get github.com/oaswrap/gswag
```

## Install Ginkgo (if needed)

```bash
go get github.com/onsi/ginkgo/v2
go get github.com/onsi/gomega
```

To also install the `ginkgo` CLI for running suites and parallel execution:

```bash
go install github.com/onsi/ginkgo/v2/ginkgo@latest
```

## Bootstrap a Ginkgo suite

If your package does not yet have a Ginkgo suite file, generate one:

```bash
cd your/package
ginkgo bootstrap
```

This creates a `suite_test.go` that you then customise with `gswag.Init` and `gswag.WriteSpec` (see [Quick Start](/docs/gswag/quick-start)).
