import { Path, Editor as SlateEditor } from 'slate';
import { Ast } from '@minddrop/ast';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { getContentStartIndex } from '../utils';

/**
 * Removes the given top level blocks, placing the cursor where
 * they were.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to remove.
 */
export function deleteBlocks(editor: Editor, paths: Path[]): void {
  // Nothing to remove
  if (!paths.length) {
    return;
  }

  const sortedPaths = [...paths].sort(Path.compare);
  const firstIndex = sortedPaths[0][0];

  SlateEditor.withoutNormalizing(editor, () => {
    // Removed last first so that the earlier paths remain valid
    for (let index = sortedPaths.length - 1; index >= 0; index -= 1) {
      Transforms.removeNodes(editor, { at: sortedPaths[index] });
    }

    const contentStartIndex = getContentStartIndex(editor);

    // The editor always holds at least one content block, so
    // emptying it leaves an empty paragraph behind.
    if (editor.children.length <= contentStartIndex) {
      Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
        at: [contentStartIndex],
      });
    }

    // The cursor takes the place of the removed blocks, falling
    // back to the end of the content when they were last.
    if (firstIndex < editor.children.length) {
      Transforms.select(editor, SlateEditor.start(editor, [firstIndex]));
    } else {
      Transforms.select(
        editor,
        SlateEditor.end(editor, [editor.children.length - 1]),
      );
    }
  });
}
