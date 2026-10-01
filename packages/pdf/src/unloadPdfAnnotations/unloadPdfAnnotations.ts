import { PdfAnnotationsStore } from '../PdfAnnotationsStore';

/**
 * Removes a document's annotations from the store.
 *
 * @param path - The absolute path of the PDF file.
 */
export function unloadPdfAnnotations(path: string): void {
  PdfAnnotationsStore.remove(path);
}
