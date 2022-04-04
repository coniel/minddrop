import {
  RichTextDocument,
  RichTextDocuments,
  RichTextElements,
} from '@minddrop/rich-text';
import { useMemo } from 'react';
import { Descendant } from 'slate';

/**
 * Returns the rich text editor's initial value created
 * based on the rich text document's `children` property.
 *
 * @param documentId The ID of the document being edited.
 * @returns The rich text editor's initial value.
 */
export function useEditorInitialValue(documentId: string): Descendant[] {
  // Get the rich text document being edited
  const document = useMemo(
    () => RichTextDocuments.get(documentId),
    [documentId],
  ) as RichTextDocument;

  // Get the document's root level rich text child elements
  const rootElements = useMemo(
    () => RichTextElements.get(document.children),
    [documentId],
  );

  // Create the initial value by ordering the root level
  // elements according to the order in which they appear
  // in in the document's `children` property.
  const initialValue = useMemo(
    () =>
      document.children.map((childId) => rootElements[childId]) as Descendant[],
    [documentId],
  );

  return initialValue;
}
