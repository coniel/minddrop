import {
  ContentView,
  ContentViewConfig,
  ContentViews,
} from '@minddrop/content-views';
import { isEntityId } from '@minddrop/utils';
import { getEntry } from '../getEntry';
import { EntryMetadata } from '../types';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Persists an embedded virtual view's config into its owner entry's
 * metadata. Does nothing for views not owned by a database entry,
 * without an owner key, or whose entry does not exist.
 *
 * @param view - The virtual view whose config to persist.
 * @param workspaceId - The workspace the view belongs to. Omit for the active workspace.
 */
export async function persistVirtualViewConfig(
  view: ContentView,
  workspaceId?: string,
): Promise<void> {
  // Skip views not owned by a database entry
  if (!view.owner || !isEntityId(view.owner, 'database-entry')) {
    return;
  }

  // Skip views without an owner key
  if (!view.ownerKey) {
    return;
  }

  // Look up the entry the view is embedded in
  const entry = getEntry(view.owner, false, workspaceId);

  // Skip views whose entry no longer exists
  if (!entry) {
    return;
  }

  // Collect the view's persistable config
  const viewConfig: ContentViewConfig = {};

  // Include the options when set
  if (view.options !== undefined) {
    viewConfig.options = view.options;
  }

  // Include the data when set
  if (view.data !== undefined) {
    viewConfig.data = view.data;
  }

  // Serialize the config's item IDs into durable references
  const serializedConfig = ContentViews.serializeConfig(
    view.type,
    viewConfig,
    workspaceId,
  );

  // Add the config to the entry's metadata under the view's owner key
  const metadata: EntryMetadata = {
    ...entry.metadata,
    embeddedViewConfigs: {
      ...entry.metadata.embeddedViewConfigs,
      [view.ownerKey]: serializedConfig,
    },
  };

  // Persist the metadata to the entry's metadata sidecar
  await updateEntryMetadata(view.owner, metadata, workspaceId);
}
