---
title: 'Mid-run remote config/item changes only land on restart'
package: packages/databases
summary: 'Remote view, design and template file edits and config edits other than name, icon, path and properties reach the stores only on restart'
paths:
  - 'packages/databases/src/sql/backgroundSyncDatabases/**'
  - 'packages/databases/src/handleBackgroundSyncResult/**'
  - 'packages/databases/src/normalizeDatabaseConfigIds/**'
tags: [sync, config, remote-edits, restart]
---

# Mid-run remote config/item changes only land on restart

Background sync only marks a database as upserted when its name, icon, path or property schema changed (the schema by the `properties_hash` stored on its SQL record), so remote edits to other config content — and to the split-out view/design/template files in the database's `.minddrop` dir — are not applied to the frontend stores while the app is running; they land on the next launch. This predates the config split (embedded views/templates behaved the same way). The databases watcher handler leaves the view, design and history files to their own packages' handlers rather than scanning for them.

Related: `normalizeDatabaseConfigIds` reconciles the config's view/design/template ID lists against the item files at load time in the store only, deliberately never writing the config file. The files it finds (or misses) may be mid-sync, and writing the reconciled list would conflict with the incoming config; the persisted list catches up on the next genuine config mutation.
