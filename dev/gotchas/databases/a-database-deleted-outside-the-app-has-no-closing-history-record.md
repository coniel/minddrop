---
title: 'A database deleted outside the app has no closing history record'
package: packages/databases
summary: 'Background sync records a deletion found on disk in the workspace databases ledger only; the database directory is gone, so its own history never gets a deleted record and a restore cannot rely on one.'
paths:
  - 'packages/databases/src/handleBackgroundSyncResult/**'
  - 'packages/databases/src/recordSyncedDatabaseRename/**'
  - 'packages/databases/src/recordSyncedDatabaseDeletion/**'
  - 'packages/databases/src/event-handlers/database-deleted/**'
tags: [history, ledgers, background-sync]
---

# A database deleted outside the app has no closing history record

`deleteDatabase` writes a `deleted` record to the database's own history before trashing its directory, so a database put back from the system trash has its own closing record. A database deleted while the app was closed reaches `handleBackgroundSyncResult` as a deleted ID with no directory left to write into. `recordSyncedDatabaseDeletion` records the deletion in the workspace's databases ledger alone, under the name the store held and with a `DatabaseDeleted` action.

A restore following a reference into a deleted database must treat the workspace ledger's `deleted` record as the authority on whether and when the database was deleted, and must not expect the database's own history to end in `deleted`. A database's own history ending without one does not mean the database still exists.

The same asymmetry holds for renames found by the sync. `recordSyncedDatabaseRename` writes both records, since the renamed directory exists. A database put back from the trash under an unchanged name writes nothing, and its own history still ends in the `deleted` record written when it was deleted.
