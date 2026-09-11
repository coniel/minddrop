---
title: 'Offline entry renames lose their references'
package: packages/databases
summary: 'Entries renamed while the app is closed sync as delete plus create, dropping collection memberships and view references'
paths:
  - 'packages/databases/src/sql/backgroundSyncDatabases/**'
  - 'packages/databases/src/handleBackgroundSyncResult/**'
tags: [sync, renames, references, path-identity]
---

# Offline entry renames lose their references

Entry identity is path-based on disk: a file renamed while the app is closed cannot be recognised as the same entry (entry files carry no ID), so background sync treats the rename as a delete plus a create. The old entry's collection memberships and view references are cleaned up as a deletion, and the freshly minted entry starts unreferenced. This is inherent to the ID-free entry file design.
