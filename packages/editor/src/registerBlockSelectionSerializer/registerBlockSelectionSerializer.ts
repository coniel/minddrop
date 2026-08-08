import { Ast, Element } from '@minddrop/ast';
import { SelectionItem, SelectionItemSerializers } from '@minddrop/selection';
import { deleteBlocks } from '../deleteBlocks';
import { BLOCK_SELECTION_ITEM_TYPE, Editor } from '../types';
import { getBlockPathById, isBlockSelectionItem } from '../utils';

/**
 * Registers the serializer used to copy, drag, and delete selected
 * blocks from outside the editor they belong to.
 */
export function registerBlockSelectionSerializer(): void {
  SelectionItemSerializers.register({
    type: BLOCK_SELECTION_ITEM_TYPE,

    // Carried as markdown, which is the form the content is stored
    // in and the one another application can make sense of
    toPlainText: (items) => Ast.toMarkdown(getElements(items)),

    // Carried as elements as well, so that an editor receiving the
    // blocks reinstates them rather than reparsing the markdown
    toJsonString: (items) => JSON.stringify(getElements(items)),

    delete: (items) => {
      // Each editor's blocks are removed from the editor they
      // belong to, a selection being able to span several
      groupItemsByEditor(items).forEach((blockIds, editor) => {
        deleteBlocks(editor, getPaths(editor, blockIds));
      });
    },
  });
}

/**
 * Gets the elements of the blocks the given items represent.
 *
 * @param items Block selection items.
 * @returns The blocks' elements.
 */
function getElements(items: SelectionItem[]): Element[] {
  const elements: Element[] = [];

  groupItemsByEditor(items).forEach((blockIds, editor) => {
    getPaths(editor, blockIds).forEach((path) => {
      elements.push(editor.children[path[0]] as Element);
    });
  });

  return elements;
}

/**
 * Groups the block IDs of the given items by the editor they
 * belong to.
 *
 * @param items Block selection items.
 * @returns The items' block IDs, keyed by their editor.
 */
function groupItemsByEditor(items: SelectionItem[]): Map<Editor, string[]> {
  const grouped = new Map<Editor, string[]>();

  items.filter(isBlockSelectionItem).forEach((item) => {
    const blockIds = grouped.get(item.data.editor) ?? [];

    blockIds.push(item.data.blockId);
    grouped.set(item.data.editor, blockIds);
  });

  return grouped;
}

/**
 * Resolves block IDs to the paths of the blocks carrying them, in
 * document order.
 *
 * @param editor An editor instance.
 * @param blockIds The IDs of the blocks to resolve.
 * @returns The blocks' paths.
 */
function getPaths(editor: Editor, blockIds: string[]) {
  return (
    blockIds
      .map((blockId) => getBlockPathById(editor, blockId))
      // The blocks may since have been removed from the document
      .filter((path) => path !== null)
      .sort((pathA, pathB) => pathA[0] - pathB[0])
  );
}
