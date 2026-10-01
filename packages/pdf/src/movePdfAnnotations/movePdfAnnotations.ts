import { PdfAnnotationsStore } from '../PdfAnnotationsStore';

/**
 * Re-keys a document's annotations in the store when its file moves.
 * Does nothing when the document has no loaded annotations.
 *
 * @param fromPath - The absolute path the PDF file moved from.
 * @param toPath - The absolute path the PDF file moved to.
 */
export function movePdfAnnotations(fromPath: string, toPath: string): void {
  // Get the document's stored annotations
  const document = PdfAnnotationsStore.get(fromPath);

  // Check if the document's annotations are loaded. If not, there is
  // nothing to move.
  if (!document) {
    return;
  }

  // Re-key the annotations under the new path
  PdfAnnotationsStore.remove(fromPath);
  PdfAnnotationsStore.set({ ...document, path: toPath });
}
