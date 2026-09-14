import { ItemReferences } from '@minddrop/item-references';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { initializeDatabaseAutomations } from '../initializeDatabaseAutomations';
import { initializeDatabaseEventHandlers } from '../initializeDatabaseEventHandlers';
import { initializeDatabaseTemplates } from '../initializeDatabaseTemplates';
import { registerDatabaseEntryFilterAdapter } from '../registerDatabaseEntryFilterAdapter';
import {
  matchDatabaseEntryReference,
  matchDatabaseReference,
  serializeDatabaseEntryReference,
  serializeDatabaseReference,
} from '../utils';

/**
 * Initializes databases: registers the core entry serializers, the
 * item reference adapters, the event handlers, and the core
 * database templates and automations.
 */
export function initializeDatabases(): void {
  // Load core entry serializers
  loadCoreSerializers();

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

  // Register the entry filter adapter
  registerDatabaseEntryFilterAdapter();

  // Register event handlers
  initializeDatabaseEventHandlers();

  // Load database templates and automation configs
  initializeDatabaseTemplates();
  initializeDatabaseAutomations();
}
