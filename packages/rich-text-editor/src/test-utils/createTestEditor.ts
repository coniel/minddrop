import { RichTextBlockElement, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { Transforms } from '../Transforms';
import { addChildrenToVoidElements, createEditor } from '../utils';

const { richTextDocument1 } = RICH_TEXT_TEST_DATA;

/**
 * Creates a new editor with the given content.
 *
 * @param content The editor's content.
 * @param documentId The ID of the document being edited.
 * @returns A new editor.
 */
export function createTestEditor(
  content: RichTextBlockElement[] = [],
  documentId = richTextDocument1.id,
) {
  // Create an editor
  const editor = createEditor(documentId);

  if (content) {
    // If content was provided, set the content in the editor
    Transforms.resetNodes(editor, {
      nodes: addChildrenToVoidElements(content),
    });
  }

  return editor;
}
