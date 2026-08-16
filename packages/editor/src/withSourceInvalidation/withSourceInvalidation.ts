import { Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Drops the source a block was parsed from as soon as the block is edited.
 *
 * A block re-emits its original source verbatim, which is what keeps an
 * untouched document byte identical. Once its content changes that source
 * no longer describes it, so it is cleared and the block is rebuilt from
 * its own data instead.
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
    const paths = resolveTouchedBlockIndexes(editor, operation);

    apply(operation);

    paths.forEach((index) => {
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
  };

  return editor;
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
