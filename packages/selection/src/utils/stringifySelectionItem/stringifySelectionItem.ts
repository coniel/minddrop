import { SelectionItem } from '../../types';

/**
 * Stringifies a SelectionItem into a string of the format:
 * 'resource-type:resource-id[:parent-type:parent-id]'
 * to allow for string comparisons of different selection
 * items.
 *
 * @param item - The selection item to stringify.
 * @returns A string.
 */
export function stringifySelectionItem(item: SelectionItem) {
  let string = `${item.resource}:${item.id}`;

  if (item.parent) {
    string = `${string}:${item.parent.resource}:${item.parent.id}`;
  }

  return string;
}
