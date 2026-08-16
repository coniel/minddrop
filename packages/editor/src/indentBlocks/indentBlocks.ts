import { Path, Editor as SlateEditor } from 'slate';
import { applyAncestryChanges } from '../applyAncestryChanges';
import { resolveIndentedAncestry } from '../utils';

/**
 * Nests blocks one level deeper into the containers around them, along with
 * everything nested inside them.
 *
 * Blocks markdown has nowhere to nest, such as the first item of a list, are
 * left where they are.
 *
 * @param editor - An editor instance.
 * @param paths - The paths of the blocks to indent.
 */
export function indentBlocks(editor: SlateEditor, paths: Path[]): void {
  applyAncestryChanges(editor, paths, resolveIndentedAncestry);
}
