import { useCore } from '@minddrop/core';
import { RichTextDocuments } from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import { useMemo } from 'react';
import { Editor } from '../types';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { createEditor } from '../utils';
import { withRichTextElementsApi } from '../withRichTextElementsApi';

/**
 * Returns an editor instance configured with an editor
 * session which persists changes made to the document's
 * contents.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document being edited.
 * @returns An editor and the session ID instance.
 */
export function useEditorSession(documentId: string): [Editor, string] {
  const core = useCore('rich-text-editor');

  // Set up the editor session
  const sessionId = useMemo(() => {
    // Generate a session ID
    const id = generateId();
    // Get the rich text document
    const document = RichTextDocuments.get(documentId);

    // Create the session in the rich text editor store with the
    // current document revision.
    useRichTextEditorStore
      .getState()
      .addSession(id, document.id, document.revision);

    // Return the session ID
    return id;
  }, [documentId]);

  // Create the editor instance
  const editor = useMemo(
    () => withRichTextElementsApi(core, createEditor(documentId), sessionId),
    [documentId, sessionId],
  );

  return [editor, sessionId];
}
