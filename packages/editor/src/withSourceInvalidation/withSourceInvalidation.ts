import { Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Drops the source a block was parsed from as soon as the block is edited,
 * and the spacing it was parsed with as soon as a different block follows
 * it.
 *
 * A block re-emits its original source verbatim, which is what keeps an
 * untouched document byte identical. Once its content changes that source
 * no longer describes it, so it is cleared and the block is rebuilt from
 * its own data instead.
 *
 * A block's spacing describes the gap to the block which followed it when
 * the document was parsed, so it survives an edit to the block's content
 * but not a change to which block comes next.
 *
 * The document's trailing whitespace, such as its final newline, rides on
 * whichever block is last, so it is handed to the block which ends the
 * document rather than being lost with the block which used to.
 *
 * Blocks are found through the operations Slate applied rather than by
 * comparing nodes, since Slate replaces node objects on every change and a
 * node's identity cannot be tracked by reference.
 *
 * @param editor An editor instance.
 * @returns The editor instance with the plugin behaviour applied.
 */
export function withSourceInvalidation(editor: Editor): Editor {
  const { apply } = editor;

  editor.apply = (operation) => {
    const editedIndexes = resolveTouchedBlockIndexes(editor, operation);
    const resequencedIndexes = resolveResequencedBlockIndexes(operation);
    const resequences = isBlockResequence(operation);
    // Read before the operation, which may change which block is last
    const trailingSpacing = resequences
      ? resolveTrailingSpacing(editor)
      : undefined;

    apply(operation);

    editedIndexes.forEach((index) => {
      const block = editor.children[index] as Element | undefined;

      // The block may have been removed by the operation
      if (!block || !SlateElement.isElement(block)) {
        return;
      }

      // Nothing to invalidate on a block which has already been edited
      if (block.source === undefined) {
        return;
      }

      Transforms.unsetNodes(editor, 'source', { at: [index] });
    });

    resequencedIndexes.forEach((index) => {
      const block = editor.children[index] as Element | undefined;

      // The block may have been removed by the operation
      if (!block || !SlateElement.isElement(block)) {
        return;
      }

      // Nothing to invalidate on a block which has already been edited
      if (block.spacingAfter === undefined) {
        return;
      }

      Transforms.unsetNodes(editor, 'spacingAfter', { at: [index] });
    });

    // Applied after the invalidation above, which is what leaves the block
    // ending the document without any spacing to hold
    if (resequences) {
      applyTrailingSpacing(editor, trailingSpacing);
    }
  };

  return editor;
}

/**
 * Returns the whitespace the document ends with.
 *
 * @param editor - An editor instance.
 * @returns The trailing whitespace, if the document has any.
 */
function resolveTrailingSpacing(editor: Editor): string | undefined {
  const last = editor.children[editor.children.length - 1] as
    | Element
    | undefined;

  return last?.spacingAfter;
}

/**
 * Gives the document's trailing whitespace to the block which now ends it.
 *
 * @param editor - An editor instance.
 * @param spacing - The whitespace the document ended with.
 */
function applyTrailingSpacing(
  editor: Editor,
  spacing: string | undefined,
): void {
  const index = editor.children.length - 1;
  const last = editor.children[index] as Element | undefined;

  // The operation may have emptied the document
  if (!last || !SlateElement.isElement(last)) {
    return;
  }

  // The block ending the document already carries the right spacing, which
  // is the case whenever the operation left the last block in place
  if (last.spacingAfter === spacing) {
    return;
  }

  // A document which ended on a block the editor created has no trailing
  // whitespace to hand on
  if (spacing === undefined) {
    Transforms.unsetNodes(editor, 'spacingAfter', { at: [index] });

    return;
  }

  Transforms.setNodes(editor, { spacingAfter: spacing }, { at: [index] });
}

/**
 * Returns the top level blocks an operation changes the content of.
 *
 * Selection changes are ignored, since moving the cursor does not alter the
 * document. Structural operations are attributed to the blocks on both
 * sides of the change, because splitting or merging rewrites both.
 *
 * @param editor - An editor instance.
 * @param operation - The operation about to be applied.
 * @returns The indexes of the affected blocks.
 */
function resolveTouchedBlockIndexes(
  editor: Editor,
  operation: Parameters<Editor['apply']>[0],
): number[] {
  // Moving the cursor leaves the document alone
  if (operation.type === 'set_selection') {
    return [];
  }

  // A block's containers are written as line prefixes, which are
  // composed from its ancestry rather than taken from its source, so
  // moving a block between containers leaves its source describing it
  if (isAncestryChange(operation)) {
    return [];
  }

  const indexes = new Set<number>();

  if ('path' in operation && operation.path.length) {
    indexes.add(operation.path[0]);
  }

  // A move rewrites where the node left as well as where it arrived
  if (operation.type === 'move_node' && operation.newPath.length) {
    indexes.add(operation.newPath[0]);
  }

  // Splitting or merging a node changes the block after it too
  if (
    (operation.type === 'split_node' || operation.type === 'merge_node') &&
    operation.path.length
  ) {
    indexes.add(operation.path[0] + 1);
  }

  return [...indexes].filter((index) => index < editor.children.length);
}

/**
 * Returns the blocks which the operation gives a different following block,
 * making the spacing they were parsed with describe a gap which is no
 * longer there.
 *
 * @param operation - The operation about to be applied.
 * @returns The indexes of the affected blocks.
 */
function resolveResequencedBlockIndexes(
  operation: Parameters<Editor['apply']>[0],
): number[] {
  if (!isBlockResequence(operation) || !('path' in operation)) {
    return [];
  }

  const index = operation.path[0];
  const indexes = new Set<number>();

  // A split puts a new block directly after the one it split, while the
  // other half carries the original spacing on to the block after it
  if (operation.type === 'split_node') {
    indexes.add(index);
  }

  // Adding a block, removing one, or merging one away all change what
  // follows the block before it
  if (
    operation.type === 'insert_node' ||
    operation.type === 'remove_node' ||
    operation.type === 'merge_node'
  ) {
    indexes.add(index - 1);
  }

  // A move reorders both ends, and the moved block is now followed by a
  // different block itself, so the whole neighbourhood of the move is
  // cleared rather than worked out position by position
  if (operation.type === 'move_node' && operation.newPath.length === 1) {
    indexes.add(index - 1);
    indexes.add(index);
    indexes.add(operation.newPath[0] - 1);
    indexes.add(operation.newPath[0]);
  }

  return [...indexes];
}

/**
 * Checks whether an operation changes which blocks the document holds or
 * the order they sit in.
 *
 * Only operations on top level nodes rearrange blocks, since anything
 * deeper happens inside a block rather than beside it.
 *
 * @param operation - The operation about to be applied.
 * @returns Whether the operation rearranges the document's blocks.
 */
function isBlockResequence(operation: Parameters<Editor['apply']>[0]): boolean {
  if (!('path' in operation) || operation.path.length !== 1) {
    return false;
  }

  // A move within a block leaves the document's blocks as they were
  if (operation.type === 'move_node') {
    return operation.newPath.length === 1;
  }

  return (
    operation.type === 'insert_node' ||
    operation.type === 'remove_node' ||
    operation.type === 'split_node' ||
    operation.type === 'merge_node'
  );
}

/**
 * Checks whether an operation only changes which containers a block sits
 * inside.
 *
 * @param operation - The operation about to be applied.
 * @returns Whether the operation is an ancestry change.
 */
function isAncestryChange(operation: Parameters<Editor['apply']>[0]): boolean {
  if (operation.type !== 'set_node') {
    return false;
  }

  const changed = [
    ...Object.keys(operation.newProperties),
    ...Object.keys(operation.properties),
  ];

  return changed.length > 0 && changed.every((key) => key === 'ancestry');
}
