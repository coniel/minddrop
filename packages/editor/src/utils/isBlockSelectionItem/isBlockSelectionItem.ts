import { SelectionItem } from '@minddrop/selection';
import { BLOCK_SELECTION_ITEM_TYPE, BlockSelectionItem } from '../../types';

/**
 * Checks whether a selection item represents an editor block.
 *
 * @param item A selection item.
 * @returns Whether the item is a block.
 */
export function isBlockSelectionItem(
  item: SelectionItem,
): item is BlockSelectionItem {
  return item.type === BLOCK_SELECTION_ITEM_TYPE;
}
