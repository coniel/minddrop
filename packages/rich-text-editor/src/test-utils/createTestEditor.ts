import { RTBlockElement } from '@minddrop/rich-text';
import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { Transforms } from '../Transforms';
import { addChildrenToVoidElements, createEditor } from '../utils';

const { emptyParagraphElement } = RICH_TEXT_TEST_DATA;

/**
 * Creates a new editor with the given content.
 *
 * @param content The editor's content.
 * @param documentId The ID of the document being edited.
 * @returns A new editor.
 */
export function createTestEditor(
  content: RTBlockElement[] = [emptyParagraphElement],
) {
  // Create an editor
  const editor = createEditor();

  if (content) {
    // If content was provided, set the content in the editor
    Transforms.resetNodes(editor, {
      nodes: addChildrenToVoidElements(content),
    });
  }

  return editor;
}
