import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Selection } from '@minddrop/selection';
import { Transforms } from '../Transforms';
import {
  BLOCK_SELECTION_ITEM_TYPE,
  BlockSelectionItem,
  Editor,
} from '../types';
import { hasBlockId, resolveClosedBlockRange } from '../utils';

/**
 * Selects the top level blocks between two blocks, covering both
 * of them whole.
 *
 * The blocks are selected in the app's selection as well as in the
 * editor, which is what makes the selection exclusive across the
 * app, and what allows the blocks to be dragged out of the editor.
 *
 * The selection keeps the direction implied by the given blocks,
 * so that extending it with the keyboard grows and shrinks from
 * the focused end.
 *
 * @param editor An editor instance.
 * @param anchorPath The path of the block the selection is anchored to.
 * @param focusPath The path of the block the selection is focused on.
 */
export function selectBlocks(
  editor: Editor,
  anchorPath: Path,
  focusPath: Path,
): void {
  // Selecting a block selects everything drawn inside it, which the
  // blocks below it can be
  const { firstIndex, lastIndex } = resolveClosedBlockRange(
    editor.children as Element[],
    {
      firstIndex: Math.min(anchorPath[0], focusPath[0]),
      lastIndex: Math.max(anchorPath[0], focusPath[0]),
    },
  );

  // A selection running up the document is anchored to the end of
  // its anchor block rather than the start.
  const backward = Path.isBefore(focusPath, anchorPath);
  const anchorIndex = backward ? lastIndex : firstIndex;
  const focusIndex = backward ? firstIndex : lastIndex;

  const anchor = backward
    ? SlateEditor.end(editor, [anchorIndex])
    : SlateEditor.start(editor, [anchorIndex]);
  const focus = backward
    ? SlateEditor.start(editor, [focusIndex])
    : SlateEditor.end(editor, [focusIndex]);

  Transforms.select(editor, { anchor, focus });

  Selection.select(buildBlockSelectionItems(editor, firstIndex, lastIndex));
}

/**
 * Builds the selection items representing a range of top level
 * blocks.
 *
 * @param editor An editor instance.
 * @param firstIndex The index of the first block in the range.
 * @param lastIndex The index of the last block in the range.
 * @returns The blocks' selection items.
 */
function buildBlockSelectionItems(
  editor: Editor,
  firstIndex: number,
  lastIndex: number,
): BlockSelectionItem[] {
  const items: BlockSelectionItem[] = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const block = editor.children[index];

    // Blocks are identified by their block ID, which the block ID
    // plugin gives every top level block
    if (!SlateElement.isElement(block) || !hasBlockId(block)) {
      continue;
    }

    items.push({
      id: block.id,
      type: BLOCK_SELECTION_ITEM_TYPE,
      data: { editor, blockId: block.id },
    });
  }

  return items;
}
