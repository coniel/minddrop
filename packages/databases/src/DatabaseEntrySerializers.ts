import { DatabaseEntrySerializersStore } from './DatabaseEntrySerializersStore';
import { coreEntrySerializers } from './entry-serializers';

export {
  DatabaseEntrySerializersStore as Store,
  useDatabaseEntrySerializer as use,
  useDatabaseEntrySerializerSerializers as useAll,
} from './DatabaseEntrySerializersStore';

/**
 * Loads the core entry serializers (json, yaml, markdown) into
 * the serializers store. Called during initialization or from
 * the Bun process for search indexing.
 */
export function loadCoreSerializers(): void {
  DatabaseEntrySerializersStore.load(coreEntrySerializers);
}
