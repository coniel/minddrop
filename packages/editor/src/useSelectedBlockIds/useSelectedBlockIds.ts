import { useEffect, useMemo } from 'react';
import { Selection } from '@minddrop/selection';
import { clearBlockSelection } from '../clearBlockSelection';
import { Editor } from '../types';
import { isBlockSelectionItem } from '../utils';

/**
 * Tracks which of the editor's blocks are in the app's selection.
 *
 * Watching the app's selection rather than the editor's own is what
 * makes a selection made elsewhere, in another editor or otherwise,
 * deselect the editor's blocks.
 *
 * @param editor An editor instance.
 * @returns The IDs of the editor's selected blocks.
 */
export function useSelectedBlockIds(editor: Editor): ReadonlySet<string> {
  const selection = Selection.use();

  const selectedBlockIds = useMemo(
    () =>
      new Set(
        selection
          .filter(isBlockSelectionItem)
          .filter((item) => item.data.editor === editor)
          .map((item) => item.data.blockId),
      ),
    [selection, editor],
  );

  // A closed editor leaves nothing of itself in the app's selection
  useEffect(() => () => clearBlockSelection(editor), [editor]);

  return selectedBlockIds;
}
