import { RichTextBlockElement } from '@minddrop/rich-text';
import { Transforms } from '../Transforms';
import { addChildrenToVoidElements, createEditor } from '../utils';

/**
 * Creates a new editor with the given content.
 *
 * @param content The editor's content.
 * @returns A new editor.
 */
export function createTestEditor(content: RichTextBlockElement[] = []) {
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
