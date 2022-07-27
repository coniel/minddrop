import { ResourceDocument, ResourceReference } from '@minddrop/resources';
import { SelectionItem } from '../types';

/**
 * Generates a `SelectionItem` given a resource document
 * or resource reference, and optionally a parent resource
 * document or resource reference.
 *
 * @param resource - The resource document for which to generate a selection item.
 * @param parent - The parent resource document inside which the selection item located.
 * @returns A selection item.
 */
export function item(
  resource: ResourceDocument | ResourceReference,
  parent?: ResourceDocument | ResourceReference,
): SelectionItem {
  // Create the base selection item
  const item: SelectionItem = {
    resource: resource.resource,
    id: resource.id,
  };

  if (parent) {
    // If a parent was provided, add the parent
    // resource reference to the item.
    item.parent = {
      resource: parent.resource,
      id: parent.id,
    };
  }

  return item;
}
