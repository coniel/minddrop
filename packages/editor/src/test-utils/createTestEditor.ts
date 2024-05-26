import { BlockElement } from '../types';
import { Transforms } from '../Transforms';
import { createEditor } from '../utils';
import { emptyParagraphElement } from './editor.data';

/**
 * Creates a new editor with the given content.
 *
 * @param content The editor's content.
 * @param documentId The ID of the document being edited.
 * @returns A new editor.
 */
export function createTestEditor(
  content: BlockElement[] = [emptyParagraphElement],
) {
  // Create an editor
  const editor = createEditor();

  if (content) {
    // If content was provided, set the content in the editor
    Transforms.resetNodes(editor, {
      nodes: content,
    });
  }

  return editor;
}
