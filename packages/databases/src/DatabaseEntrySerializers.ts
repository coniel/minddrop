import { NotRegisteredError } from '@minddrop/stores';
import { DatabaseEntrySerializersRegistry } from './DatabaseEntrySerializersRegistry';
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
} = DatabaseEntrySerializersRegistry;

/**
 * Loads the core entry serializers (json, yaml, markdown) into
 * the serializers registry. Called during initialization or from
 * the Bun process for search indexing.
 */
export function loadCoreSerializers(): void {
  DatabaseEntrySerializersRegistry.store.load(coreEntrySerializers);
}
