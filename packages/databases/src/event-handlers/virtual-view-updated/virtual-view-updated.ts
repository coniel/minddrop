import { View, ViewUpdatedEventData } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntryMetadata } from '../../types';
import { updateEntryMetadata } from '../../updateEntryMetadata';
import { parseVirtualViewId, viewMetadataKey } from '../../utils';

/**
 * Called when a view is updated. If the view is a virtual entry view,
 * persists the updated options and data to the entry's metadata file.
 */
export function onUpdateVirtualView(data: ViewUpdatedEventData): void {
  const { updated } = data;

  // Only handle virtual views
  if (!updated.virtual) {
    return;
  }

  // Parse the virtual view ID to get the entry and config key
  const parsed = parseVirtualViewId(updated.id);

  if (!parsed) {
    return;
  }

  // Verify the entry exists in the store
  const entry = DatabaseEntriesStore.get(parsed.entryId);

  if (!entry) {
    return;
  }

  // Build the metadata key as propertyName:designId
  const metadataKey = viewMetadataKey(parsed.propertyName, parsed.designId);

  // Extract the view config to persist
  const viewConfig: Pick<View, 'options' | 'data'> = {};

  if (updated.options !== undefined) {
    viewConfig.options = updated.options;
  }

  if (updated.data !== undefined) {
    viewConfig.data = updated.data;
  }

  // Update the entry's metadata with the new view config
  const metadata: DatabaseEntryMetadata = {
    ...entry.metadata,
    views: {
      ...entry.metadata.views,
      [metadataKey]: viewConfig,
    },
  };

  // Update the in-memory entry with the new metadata
  DatabaseEntriesStore.set({ ...entry, metadata });

  // Queue the metadata for persistence
  updateEntryMetadata(parsed.entryId, metadata);
}
