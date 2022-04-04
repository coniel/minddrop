import { Core } from '@minddrop/core';
import { generateId } from '@minddrop/utils';
import { useMemo } from 'react';
import { Editor } from '../types';
import { useDebouncedUpdates } from '../useDebouncedUpdates';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { createEditor } from '../utils';
import { withParentReferences } from '../withParentReferences';
import { withRichTextEditorStore } from '../withRichTextEditorStore';

/**
 * Returns an editor instance configured with an editor
 * session which trackes changes made to the document's
 * contents in the rich text editor store.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document being edited.
 * @returns An editor and the session ID instance.
 */
export function useEditorSession(documentId: string): [Editor, string] {
  // Set up the editor session
  const sessionId = useMemo(() => {
    // Generate a session ID
    const id = generateId();

    // Create the session in the rich text editor store
    useRichTextEditorStore.getState().addSession(id);

    // Return the session ID
    return id;
  }, [documentId]);

  // Create the editor instance
  const editor = useMemo(
    () => withRichTextEditorStore(createEditor(documentId), sessionId),
    [documentId],
  );

  return [editor, sessionId];
}