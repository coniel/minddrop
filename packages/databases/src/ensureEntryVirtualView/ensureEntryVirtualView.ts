import { ContentView, ContentViews } from '@minddrop/content-views';
import { getEntry } from '../getEntry';
import {
  embeddedViewConfigKey,
  parseVirtualCollectionId,
  virtualViewId,
} from '../utils';

/**
 * Creates the virtual view a design element embeds for a virtual
 * collection. Applies the config saved in the entry's metadata.
 * Returns the existing view when one has already been created for
 * the element and view type.
 *
 * @param collectionId - The virtual collection ID.
 * @param elementId - The ID of the design element embedding the view.
 * @param viewType - The view's type.
 * @returns The virtual view.
 *
 * @throws {EntryNotFoundError} If the collection's entry does not exist.
 * @throws {NotRegisteredError} If the view type is not registered.
 */
export function ensureEntryVirtualView(
  collectionId: string,
  elementId: string,
  viewType: string,
): ContentView {
  // Resolve the view's ID
  const viewId = virtualViewId(collectionId, elementId, viewType);

  // Check if the view has already been created
  const existing = ContentViews.get(viewId, false);

  // Return the existing view
  if (existing) {
    return existing;
  }

  // Get the entry owning the collection
  const { entryId, propertyName } = parseVirtualCollectionId(collectionId);
  const entry = getEntry(entryId);

  // Resolve the config saved for the element's view type into item IDs
  const configKey = embeddedViewConfigKey(elementId, viewType);
  const savedConfig = entry.metadata.embeddedViewConfigs?.[configKey];
  const config = savedConfig
    ? ContentViews.resolveConfig(viewType, savedConfig)
    : undefined;

  // Create the view for the collection
  return ContentViews.createVirtual({
    id: viewId,
    type: viewType,
    dataSource: { type: 'collection', id: collectionId },
    owner: entry.id,
    ownerKey: configKey,
    name: propertyName,
    options: config?.options,
    data: config?.data,
  });
}
