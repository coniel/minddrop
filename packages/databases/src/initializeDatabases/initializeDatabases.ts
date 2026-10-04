import { I18n } from '@minddrop/i18n';
import { ItemReferences } from '@minddrop/item-references';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { initializeDatabaseAutomations } from '../initializeDatabaseAutomations';
import { initializeDatabaseEventHandlers } from '../initializeDatabaseEventHandlers';
import { initializeDatabaseTemplates } from '../initializeDatabaseTemplates';
import { locales } from '../locales';
import { registerDatabaseEntryFilterAdapter } from '../registerDatabaseEntryFilterAdapter';
import {
  matchDatabaseEntryReference,
  matchDatabaseReference,
  serializeDatabaseEntryReference,
  serializeDatabaseReference,
} from '../utils';

/**
 * Initializes databases: registers the translations, the core entry
 * serializers, the item reference adapters, the event handlers, and
 * the core database templates and automations.
 */
export function initializeDatabases(): void {
  // Register the translations, which the templates are named with
  I18n.registerTranslations(locales);

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
