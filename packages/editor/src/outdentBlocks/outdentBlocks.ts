import { Path, Editor as SlateEditor } from 'slate';
import { applyAncestryChanges } from '../applyAncestryChanges';
import { resolveOutdentedAncestry } from '../utils';

/**
 * Lifts blocks out of their innermost container, along with everything
 * nested inside them.
 *
 * @param editor - An editor instance.
 * @param paths - The paths of the blocks to outdent.
 */
export function outdentBlocks(editor: SlateEditor, paths: Path[]): void {
  applyAncestryChanges(editor, paths, resolveOutdentedAncestry);
}
