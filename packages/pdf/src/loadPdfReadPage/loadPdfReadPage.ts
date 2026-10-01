import { PdfReadPagesStore } from '../PdfReadPagesStore';

/**
 * Loads the page of a document last read into the store, replacing any
 * it holds for the document.
 *
 * @param path - The absolute path of the PDF file.
 * @param page - The page last read, 1-based.
 */
export function loadPdfReadPage(path: string, page: number): void {
  PdfReadPagesStore.set({ path, page });
}
