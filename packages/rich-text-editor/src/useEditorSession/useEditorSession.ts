import { useCore } from '@minddrop/core';
import {
  RichTextDocuments,
  useRichTextElementTypeConfigs,
} from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import { useMemo } from 'react';
import { Editor } from '../types';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { createEditor } from '../utils';
import { withBlockReset } from '../withBlockReset';
import { withBlockShortcuts } from '../withBlockShortcuts';
import { withParentReferences } from '../withParentReferences';
import { withRichTextElementsApi } from '../withRichTextElementsApi';

/**
 * Returns an editor instance configured with plugins and
 * an editor session which persists changes made to the
 * document's contents.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document being edited.
 * @returns An editor and the session ID instance.
 */
export function useEditorSession(documentId: string): [Editor, string] {
  const core = useCore('rich-text-editor');
  // Get the configuration objects of all registered rich
  // text element types.
  const configs = useRichTextElementTypeConfigs();

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
    () =>
      withBlockReset(
        core,
        withBlockShortcuts(
          core,
          withParentReferences(
            withRichTextElementsApi(core, createEditor(), sessionId),
            documentId,
          ),
          configs,
        ),
      ),
    [documentId, sessionId, configs.length],
  );

  return [editor, sessionId];
}
