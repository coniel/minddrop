---
title: 'A database config edit picked up by a full scan lands only partly mid-run'
package: packages/databases
summary: 'Remote edits to database.json and to view, design and template files land mid-run; a config edit reached by a full scan rather than the targeted config sync lands only name, icon, path and schema'
paths:
  - 'packages/databases/src/sql/backgroundSyncDatabases/**'
  - 'packages/databases/src/sql/syncDatabaseConfigs/**'
  - 'packages/databases/src/handleBackgroundSyncResult/**'
  - 'packages/databases/src/normalizeDatabaseConfigIds/**'
  - 'packages/databases/src/event-handlers/file-system-changed/**'
tags: [sync, config, remote-edits, restart]
---

# A database config edit picked up by a full scan lands only partly mid-run

What lands mid-run: an edit to a database's `.minddrop/database.json` made outside the app (another window, another device) is routed by the databases watcher handler to `syncDatabaseConfigs`. It re-reads that one config, upserts the database and returns it in the changeset's `upsertedDatabases`, so the store takes the whole new config (icon, settings, view/design/template ID lists...) and `handleBackgroundSyncResult` reloads that database's views, designs and templates. Its entries are re-read only when the property schema hash changed. A config which is gone, claims another ID, or changes `entrySerializer` or `propertyFileStorage` falls back to a full workspace scan.

Edits to the database's view, design and template files themselves also land mid-run. The watcher handler classifies them as `view`, `design` and `entry-template` and reloads the one item in the renderer (`reloadDatabaseView`, `reloadDatabaseDesign`, `reloadDatabaseEntryTemplate`), with no backend sync. A file which cannot be parsed leaves the store's item as it is.

What does not: the full scan (`backgroundSyncDatabases`) only marks a database as upserted when its name, icon, path or property schema changed (the schema by the `properties_hash` stored on its SQL record). So a config edit picked up by a scan rather than by the targeted config sync (e.g. one arriving in a burst that tips into a scan) lands only those fields mid-run. The rest of the config reaches the store on the next launch.

Related: `normalizeDatabaseConfigIds` reconciles the config's view/design/template ID lists against the item files at load time, and against the loaded items when an item file is reloaded, in the store only. It deliberately never writes the config file. The files it finds (or misses) may be mid-sync, and writing the reconciled list would conflict with the incoming config; the persisted list catches up on the next genuine config mutation.
