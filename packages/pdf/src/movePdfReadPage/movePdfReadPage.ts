import { PdfReadPagesStore } from '../PdfReadPagesStore';

/**
 * Re-keys the page of a document last read when its file moves. Does
 * nothing when no page is recorded for the document.
 *
 * @param fromPath - The absolute path the PDF file moved from.
 * @param toPath - The absolute path the PDF file moved to.
 */
export function movePdfReadPage(fromPath: string, toPath: string): void {
  // Get the document's recorded page
  const readPage = PdfReadPagesStore.get(fromPath);

  // Check if a page is recorded. If not, there is nothing to move.
  if (!readPage) {
    return;
  }

  // Re-key the page under the new path
  PdfReadPagesStore.remove(fromPath);
  PdfReadPagesStore.set({ ...readPage, path: toPath });
}
