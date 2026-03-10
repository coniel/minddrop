import { Collections } from '@minddrop/collections';
import {
  ContainerElement,
  Design,
  DesignElement,
  RootElement,
  ViewElement,
} from '@minddrop/designs';
import { Views } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { virtualCollectionId } from '../virtualCollectionId';
import { virtualCollectionName } from '../virtualCollectionName';
import { virtualViewId } from '../virtualViewId';

/**
 * Creates virtual collections and views for a database entry's
 * collection properties. For each collection property mapped to
 * a view element in the design, creates a virtual collection
 * containing the entry IDs and a virtual view with the element's
 * view type.
 *
 * Uses deterministic IDs so repeated calls for the same entry
 * are idempotent. Virtual resources are not cleaned up and
 * persist in memory for the lifetime of the application.
 *
 * @param entryId - The database entry ID.
 * @param design - The design being used to render the entry.
 * @param propertyMap - Map of element IDs to property names.
 * @returns A map of property names to virtual view IDs.
 */
export function createEntryVirtualViews(
  entryId: string,
  design: Design,
  propertyMap: Record<string, string>,
): Record<string, string> {
  const entry = DatabaseEntriesStore.get(entryId);

  if (!entry) {
    return {};
  }

  const database = DatabasesStore.get(entry.database);

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

    // Find the element in the design tree to get its viewType
    const element = findElementById(design.tree, elementId);

    if (!element || element.type !== 'view') {
      continue;
    }

    const viewType = (element as ViewElement).viewType;
    const collId = virtualCollectionId(entryId, property.name);
    const collName = virtualCollectionName(
      database.name,
      entry.title,
      property.name,
    );
    const viewId = virtualViewId(entryId, property.name, design.id);
    const entries = (entry.properties[property.name] as string[]) ?? [];

    // Create the virtual collection if it doesn't exist
    if (!Collections.get(collId, false)) {
      Collections.createVirtual(collId, collName, entries);
    }

    // Create the virtual view if it doesn't exist
    if (!Views.get(viewId, false)) {
      Views.createVirtual(
        viewId,
        viewType,
        {
          type: 'collection',
          id: collId,
        },
        property.name,
      );
    }

    viewIds[property.name] = viewId;
  }

  return viewIds;
}

/**
 * Recursively searches a design element tree for an element
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
