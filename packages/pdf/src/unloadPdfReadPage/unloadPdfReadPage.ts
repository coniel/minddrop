import { PdfReadPagesStore } from '../PdfReadPagesStore';

/**
 * Removes the page of a document last read from the store.
 *
 * @param path - The absolute path of the PDF file.
 */
export function unloadPdfReadPage(path: string): void {
  PdfReadPagesStore.remove(path);
}
