import {
  DataView,
  DataViewConfig,
  serializeDataViewConfig,
} from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryMetadata } from '../types';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Persists an embedded virtual view's config into its owner
 * entry's metadata, converting item references into durable form.
 *
 * @param view - The virtual view whose config to persist.
 */
export async function persistVirtualViewConfig(view: DataView): Promise<void> {
  // Skip views not owned by a database entry
  if (!view.owner || !isEntityId(view.owner, 'database-entry')) {
    return;
  }

  // Skip views missing the metadata key identifying their config
  if (!view.ownerKey) {
    return;
  }

  // Look up the entry the view is embedded in
  const entry = DatabaseEntriesStore.get(view.owner);

  // Skip views whose entry no longer exists
  if (!entry) {
    return;
  }

  // Collect the view's persistable config
  const viewConfig: DataViewConfig = {};

  if (view.options !== undefined) {
    viewConfig.options = view.options;
  }

  if (view.data !== undefined) {
    viewConfig.data = view.data;
  }

  // Convert the config's item references into durable form
  const serializedConfig = serializeDataViewConfig(view.type, viewConfig);

  const metadata: DatabaseEntryMetadata = {
    ...entry.metadata,
    embeddedViewConfigs: {
      ...entry.metadata.embeddedViewConfigs,
      [view.ownerKey]: serializedConfig,
    },
  };

  // Persist the metadata to the entry's metadata sidecar
  await updateEntryMetadata(view.owner, metadata);
}
