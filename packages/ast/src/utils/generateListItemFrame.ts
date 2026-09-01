import { uuid } from '@minddrop/utils';
import { ListItemFrame } from '../types';

/**
 * Builds a new list item in the same list as an existing one.
 *
 * The new item takes the list's marker and indentation but none of the
 * previous item's own state: its number is computed from its position, and a
 * task item starts unchecked.
 *
 * @param item - An item of the list the new item joins.
 * @returns The new item's frame.
 */
export function generateListItemFrame(item: ListItemFrame): ListItemFrame {
  const frame: ListItemFrame = {
    id: uuid(),
    kind: 'list-item',
    ordered: item.ordered,
    marker: item.marker,
    indent: item.indent,
    spread: item.spread,
  };

  // The new item is a task item when it joins a list of them
  if (item.checked !== undefined) {
    frame.checked = false;
  }

  return frame;
}
