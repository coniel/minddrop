import { Selection } from '@minddrop/selection';
import { BlockSelectionItem, Editor } from '../../types';
import { isBlockSelectionItem } from '../isBlockSelectionItem';

/**
 * Gets the selection items representing the editor's selected
 * blocks.
 *
 * @param editor An editor instance.
 * @returns The editor's selected blocks' selection items.
 */
export function getBlockSelectionItems(editor: Editor): BlockSelectionItem[] {
  return Selection.get()
    .filter(isBlockSelectionItem)
    .filter((item) => item.data.editor === editor);
}
