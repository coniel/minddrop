import { ItemReferences } from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { getDatabaseBackendAdapter } from '../DatabaseBackendAdapter';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabase } from '../getDatabase';
import { initializeDatabaseAutomations } from '../initializeDatabaseAutomations';
import { initializeDatabaseEntries } from '../initializeDatabaseEntries';
import { initializeDatabaseEventHandlers } from '../initializeDatabaseEventHandlers';
import { initializeDatabaseTemplates } from '../initializeDatabaseTemplates';
import { loadDatabaseDesigns } from '../loadDatabaseDesigns';
import { loadDatabaseEntryTemplates } from '../loadDatabaseEntryTemplates';
import { loadDatabaseViews } from '../loadDatabaseViews';
import type { Database } from '../types';
import {
  convertSqlRecordToEntry,
  matchDatabaseEntryReference,
  matchDatabaseReference,
  serializeDatabaseEntryReference,
  serializeDatabaseReference,
} from '../utils';

/**
 * Frontend orchestrator for SQL-first initialization.
 * Makes a single RPC call to the backend to get all
 * databases and entries, then hydrates frontend stores
 * and registers event handlers.
 */
export async function initializeDatabases(): Promise<{
  schemaChanged: boolean;
}> {
  // Load core entry serializers
  loadCoreSerializers();

  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return { schemaChanged: false };
  }

  // Use the first workspace
  const workspace = workspaces[0];

  // Load all databases and entries from the backend
  const backend = getDatabaseBackendAdapter();
  const result = await backend.initializeBackend(workspace.id, workspace.path);

  // Restore dates in database configs (dates arrive as
  // ISO strings over RPC).
  const databases = result.databases.map((database) =>
    restoreDates<Database>(database),
  );

  // Load database configs into the store
  DatabasesStore.load(databases);

  // Convert SQL entry records to DatabaseEntry objects
  const entries = result.entries.map((record) =>
    convertSqlRecordToEntry(record, getDatabase(record.databaseId)),
  );

  // Load entries and hydrate virtual collections
  initializeDatabaseEntries(databases, entries);

  // Register the item reference adapter for entry addresses
  ItemReferences.registerAdapter({
    type: 'database-entry',
    serialize: serializeDatabaseEntryReference,
    match: matchDatabaseEntryReference,
  });

  // Register the item reference adapter for database addresses
  ItemReferences.registerAdapter({
    type: 'database',
    serialize: serializeDatabaseReference,
    match: matchDatabaseReference,
  });

  // Load database views, designs, and entry templates from the
  // databases' config directories (before event handlers so the
  // initial load does not trigger write-back).
  await Promise.all([
    loadDatabaseViews(databases),
    loadDatabaseDesigns(databases),
    loadDatabaseEntryTemplates(databases),
  ]);

  // Register event handlers
  initializeDatabaseEventHandlers();

  // Load database templates and automation configs
  initializeDatabaseTemplates();
  initializeDatabaseAutomations();

  // Fire-and-forget background sync to detect filesystem
  // changes that occurred while the app was not running.
  // Skip if schema changed (full rebuild already scanned
  // the filesystem).
  if (!result.schemaChanged) {
    backend.backgroundSync(workspace.path);
  }

  return { schemaChanged: result.schemaChanged };
}
