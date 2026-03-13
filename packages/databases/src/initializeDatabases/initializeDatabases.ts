import { restoreDates } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { getDatabaseSqlAdapter } from '../DatabaseSqlAdapter';
import { DatabasesStore } from '../DatabasesStore';
import { initializeDatabaseAutomations } from '../initializeDatabaseAutomations';
import { initializeDatabaseEntries } from '../initializeDatabaseEntries';
import { initializeDatabaseEventHandlers } from '../initializeDatabaseEventHandlers';
import { initializeDatabaseTemplates } from '../initializeDatabaseTemplates';
import type { Database } from '../types';
import { convertSqlRecordToEntry } from '../utils';

/**
 * Frontend orchestrator for SQL-first initialization.
 * Makes a single RPC call to the backend to get all
 * databases and entries, then hydrates frontend stores
 * and registers event handlers.
 */
export async function initializeDatabases(): Promise<void> {
  // Load core entry serializers
  loadCoreSerializers();

  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return;
  }

  // Use the first workspace
  const workspace = workspaces[0];

  // Single RPC call to the backend
  const result = await getDatabaseSqlAdapter().initializeBackend(
    workspace.id,
    workspace.path,
  );

  // Restore dates in database configs (dates arrive as
  // ISO strings over RPC)
  const databases = result.databases.map((database) =>
    restoreDates<Database>(database),
  );

  // Convert SQL entry records to DatabaseEntry objects
  const entries = result.entries.map(convertSqlRecordToEntry);

  // Load database configs into the store
  DatabasesStore.load(databases);

  // Load entries and hydrate virtual collections
  initializeDatabaseEntries(databases, entries);

  // Register event handlers
  initializeDatabaseEventHandlers();

  // Load database templates and automation configs
  initializeDatabaseTemplates();
  initializeDatabaseAutomations();
}
