---
title: 'Reach for createRegistry over createObjectStore for configs'
package: packages/stores
summary: 'Use createRegistry for code-registered configs and createObjectStore for user-created entities'
paths:
  - 'packages/stores/src/createRegistry/**'
  - 'packages/stores/src/errors/NotRegisteredError.ts'
tags: [stores, registry, configs]
---

# Reach for `createRegistry` over `createObjectStore` for configs

A registry holds configs registered by code — data view types, design element configs, settings views, dev tools panels. A store holds entities created by the user, which are loaded, updated and written back. Anything a package registers at startup and only ever looks up belongs in a registry.

`createRegistry` wraps `createObjectStore`, so a registry still appears in the store registry and the dev tools inspector, and its `store` is what a test asserts against with the store matchers. What it adds is the fixed access pattern: `register`, `unregister`, a `get` which throws `NotRegisteredError` unless passed `false`, and `clear` for a package's test cleanup. The not registered error is shared across every registry and carries the registry's label and the identifier which matched nothing, so a namespace exposes it as `errors.NotRegistered` rather than declaring a class of its own.

Registration events are optional: a registry dispatches its `registered` and `unregistered` events only when created with them, and dispatches nothing on unregistering something which was never registered.
