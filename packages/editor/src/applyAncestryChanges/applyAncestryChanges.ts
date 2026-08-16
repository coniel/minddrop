import { Path, Editor as SlateEditor } from 'slate';
import { Element } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { AncestryResolver, resolveAncestryChanges } from '../utils';

/**
 * Moves blocks between the containers around them, along with everything
 * nested inside them.
 *
 * @param editor - An editor instance.
 * @param paths - The paths of the blocks to move.
 * @param resolveAncestry - Resolves a single block's new containers.
 */
export function applyAncestryChanges(
  editor: SlateEditor,
  paths: Path[],
  resolveAncestry: AncestryResolver,
): void {
  const elements = editor.children as Element[];
  const indexes = paths.map(([index]) => index);
  const changes = resolveAncestryChanges(elements, indexes, resolveAncestry);

  // Applied as one change so that a move which spans several blocks is
  // undone in one step
  SlateEditor.withoutNormalizing(editor, () => {
    changes.forEach((ancestry, index) => {
      Transforms.setNodes<Element>(editor, { ancestry }, { at: [index] });
    });
  });
}
