import { Core } from '@minddrop/core';
import { clearRegisteredRichTextElementTypes } from '../clearRegisteredRichTextElementTypes';
import { clearRichTextDocuments } from '../clearRichTextDocuments';
import { clearRichTextElements } from '../clearRichTextElements';
import { loadRichTextDocuments } from '../loadRichTextDocuments';
import { loadRichTextElements } from '../loadRichTextElements';
import { RichTextDocument, RichTextElement } from '../types';
import { useRichTextStore } from '../useRichTextStore';

export function onRun(core: Core): void {
  // Register the 'rich-text:element' resource which stores
  // rich text elements
  core.registerResource<RichTextElement>({
    type: 'rich-text:element',
    createEvent: 'rich-text-elements:create',
    updateEvent: 'rich-text-elements:update',
    deleteEvent: 'rich-text-elements:delete-permanently',
    onLoad: (elements) => loadRichTextElements(core, elements),
    onChange: (element, deleted) => {
      if (deleted) {
        // Element was deleted, remove it from the store
        useRichTextStore.getState().removeElement(element.id);
      } else {
        // Element was added or updated, set it in the store
        useRichTextStore.getState().setElement(element);
      }
    },
  });

  // Register the 'rich-text:document' resource which stores
  // rich text documents
  core.registerResource<RichTextDocument>({
    type: 'rich-text:document',
    createEvent: 'rich-text-documents:create',
    updateEvent: 'rich-text-documents:update',
    deleteEvent: 'rich-text-documents:delete-permanently',
    onLoad: (documents) => loadRichTextDocuments(core, documents),
    onChange: (document, deleted) => {
      if (deleted) {
        // Document was deleted, remove it from the store
        useRichTextStore.getState().removeDocument(document.id);
      } else {
        // Document was added or updated, set it in the store
        useRichTextStore.getState().setDocument(document);
      }
    },
  });
}

export function onDisable(core: Core): void {
  // Clear registered element types
  clearRegisteredRichTextElementTypes();
  // Clear rich text elements
  clearRichTextElements();
  // Clear rich text documents
  clearRichTextDocuments();

  // Unregsiter the 'rich-text:elements' resource
  core.unregisterResource('rich-text:element');
  // Unregsiter the 'rich-text:document' resource
  core.unregisterResource('rich-text:document');
}
