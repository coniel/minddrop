import { NotRegisteredError } from '@minddrop/stores';
import { EntrySerializersRegistry } from './EntrySerializersRegistry';
import { coreEntrySerializers } from './entry-serializers';

export const errors = {
  NotRegistered: NotRegisteredError,
};

export const {
  store: Store,
  get,
  getAll,
  use,
  useAll,
} = EntrySerializersRegistry;

/**
 * Loads the core entry serializers (json, yaml, markdown) into
 * the serializers registry. Called during initialization or from
 * the Bun process for search indexing.
 */
export function loadCoreSerializers(): void {
  EntrySerializersRegistry.store.load(coreEntrySerializers);
}
