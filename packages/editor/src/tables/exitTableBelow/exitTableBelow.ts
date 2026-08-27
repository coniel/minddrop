import { Path, Editor as SlateEditor } from 'slate';
import { Ast } from '@minddrop/ast';
import { Transforms } from '../../Transforms';
import { Editor } from '../../types';

/**
 * Moves the cursor to the start of the block after a table, adding an
 * empty paragraph when the table ends the document.
 *
 * @param editor - An editor instance.
 * @param tablePath - The table's path.
 */
export function exitTableBelow(editor: Editor, tablePath: Path): void {
  const next = Path.next(tablePath);

  // A paragraph is added when the table ends the document
  if (!SlateEditor.hasPath(editor, next)) {
    Transforms.insertNodes(editor, Ast.generateElement('paragraph'), {
      at: next,
    });
  }

  Transforms.select(editor, SlateEditor.start(editor, next));
}
