import { Core } from '@minddrop/core';
import { RichTextDocument } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Loads rich text documents into the store and dispatches a
 * `rich-text-documents:load` envent.
 *
 * @param core A MindDrop core instance.
 * @param documents The documents to load.
 */
export function loadRichTextDocuments(
  core: Core,
  documents: RichTextDocument[],
): void {
  // Load the documents into the store
  useRichTextStore.getState().loadDocuments(documents);

  // Dispatch a 'rich-text-documents:load' event
  core.dispatch('rich-text-documents:load', documents);
}
