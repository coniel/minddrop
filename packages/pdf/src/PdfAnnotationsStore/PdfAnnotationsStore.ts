import { createObjectStore } from '@minddrop/stores';
import { PdfAnnotation, PdfDocumentAnnotations } from '../types';

// The annotations of an unloaded document. Shared so that the hook
// returns a stable value.
const NoAnnotations: PdfAnnotation[] = [];

export const PdfAnnotationsStore = createObjectStore<PdfDocumentAnnotations>(
  'Pdf:Annotations',
  'path',
  { scope: 'workspace' },
);

/**
 * Returns a document's annotations, empty until they are loaded.
 *
 * @param path - The absolute path of the PDF file.
 * @returns The document's annotations.
 */
export function usePdfAnnotations(path: string): PdfAnnotation[] {
  return PdfAnnotationsStore.useItem(path)?.annotations ?? NoAnnotations;
}

/**
 * Returns one of a document's annotations, or null if it does not
 * exist or the document's annotations are not loaded.
 *
 * @param path - The absolute path of the PDF file.
 * @param id - The ID of the annotation.
 * @returns The annotation, or null.
 */
export function usePdfAnnotation(
  path: string,
  id: string,
): PdfAnnotation | null {
  return (
    usePdfAnnotations(path).find((annotation) => annotation.id === id) ?? null
  );
}
