import { Collections } from '@minddrop/collections';
import { DataViews, resolveDataViewConfig } from '@minddrop/data-views';
import {
  ContainerElement,
  DesignElement,
  Layout,
  RootElement,
  getPropertyElementConfig,
  isPropertyElement,
} from '@minddrop/designs';
import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { viewMetadataKey } from '../viewMetadataKey';
import { virtualCollectionId } from '../virtualCollectionId';
import { virtualCollectionName } from '../virtualCollectionName';
import { virtualViewId } from '../virtualViewId';

/**
 * Creates virtual collections and views for a database entry's
 * collection properties. For each collection property mapped to
 * a collection element in the layout, creates a virtual collection
 * containing the entry IDs and a virtual view with the element
 * variant's view type.
 *
 * Uses deterministic IDs so repeated calls for the same entry
 * are idempotent. Virtual resources are not cleaned up and
 * persist in memory for the lifetime of the application.
 *
 * @param entryId - The database entry ID.
 * @param layout - The layout being used to render the entry.
 * @param propertyMap - Map of element IDs to property names.
 * @returns A map of property names to virtual view IDs.
 */
export function createEntryVirtualViews(
  entryId: string,
  layout: Layout,
  propertyMap: Record<string, string>,
): Record<string, string> {
  const entry = getDatabaseEntry(entryId, false);

  if (!entry) {
    return {};
  }

  const database = getDatabase(entry.database, false);

  if (!database) {
    return {};
  }

  // Build a reverse map: property name -> element ID
  const propertyToElementId: Record<string, string> = {};

  for (const [elementId, propertyName] of Object.entries(propertyMap)) {
    propertyToElementId[propertyName] = elementId;
  }

  const viewIds: Record<string, string> = {};

  for (const property of database.properties) {
    if (property.type !== 'collection') {
      continue;
    }

    const elementId = propertyToElementId[property.name];

    if (!elementId) {
      continue;
    }

    // Find the element in the layout tree to get its view type
    const element = findElementById(layout.tree, elementId);

    if (!element || !isPropertyElement(element, 'collection')) {
      continue;
    }

    // The element's variant is the view type the embedded view
    // renders as, defaulting to the collection element's default
    const viewType =
      element.variant ?? getPropertyElementConfig('collection').defaultVariant;
    const collId = virtualCollectionId(entryId, property.name);
    const collName = virtualCollectionName(
      database.name,
      entry.title,
      property.name,
    );
    const viewId = virtualViewId(entryId, layout.id, property.name);
    const entries = (entry.properties[property.name] as string[]) ?? [];

    // Create the virtual collection if it doesn't exist
    if (!Collections.get(collId, false)) {
      Collections.createVirtual(collId, collName, entries);
    }

    // Create the virtual view if it doesn't exist, applying any
    // saved view config from entry metadata
    if (!DataViews.get(viewId, false)) {
      const metadataKey = viewMetadataKey(layout.id, property.name);
      const savedConfig = entry.metadata.embeddedViewConfigs?.[metadataKey];

      // Resolve the saved config's durable references into item IDs
      const resolvedConfig = savedConfig
        ? resolveDataViewConfig(viewType, savedConfig)
        : undefined;

      DataViews.createVirtual({
        id: viewId,
        type: viewType,
        dataSource: { type: 'collection', id: collId },
        // The entry owns the view and persists its config in its
        // metadata under the owner key
        owner: entry.id,
        ownerKey: metadataKey,
        name: property.name,
        options: resolvedConfig?.options,
        data: resolvedConfig?.data,
      });
    }

    viewIds[property.name] = viewId;
  }

  return viewIds;
}

/**
 * Recursively searches a layout element tree for an element
 * with the given ID.
 */
function findElementById(
  node: DesignElement | RootElement,
  id: string,
): DesignElement | RootElement | null {
  if (node.id === id) {
    return node;
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of (node as ContainerElement | RootElement).children) {
      const found = findElementById(child, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
}
