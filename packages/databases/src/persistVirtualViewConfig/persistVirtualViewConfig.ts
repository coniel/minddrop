import {
  DataView,
  DataViewConfig,
  serializeDataViewConfig,
} from '@minddrop/data-views';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryMetadata } from '../types';
import { updateEntryMetadata } from '../updateEntryMetadata';
import { parseVirtualViewId, viewMetadataKey } from '../utils';

/**
 * Persists an embedded virtual view's config into its entry's
 * metadata, converting item references into durable form.
 *
 * @param view - The virtual view whose config to persist.
 */
export function persistVirtualViewConfig(view: DataView): void {
  // Parse the virtual view ID into its entry/property/layout parts
  const parsed = parseVirtualViewId(view.id);

  // Skip views that are not embedded entry views
  if (!parsed) {
    return;
  }

  // Look up the entry the view is embedded in
  const entry = DatabaseEntriesStore.get(parsed.entryId);

  // Skip views whose entry no longer exists
  if (!entry) {
    return;
  }

  const metadataKey = viewMetadataKey(parsed.propertyName, parsed.layoutId);

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
      [metadataKey]: serializedConfig,
    },
  };

  // Persist the metadata to the database metadata file
  updateEntryMetadata(parsed.entryId, metadata);
}
