import { ListItemFrame } from '../types';

/**
 * Determines whether two adjacent items belong to the same list.
 *
 * Markdown has no list token to compare: a run of adjacent items is one
 * list until the marker changes, so the marker is the list's identity.
 *
 * @param item - The preceding item.
 * @param nextItem - The following item.
 * @returns Whether the items are in the same list.
 */
export function isSameList(
  item: ListItemFrame,
  nextItem: ListItemFrame,
): boolean {
  return (
    item.ordered === nextItem.ordered &&
    item.marker === nextItem.marker &&
    (item.indent || '') === (nextItem.indent || '')
  );
}
