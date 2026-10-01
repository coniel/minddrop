import { Events } from '@minddrop/events';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { PdfReadPageSetEvent } from '../events';

/**
 * Records the page of a document last read.
 *
 * @param path - The absolute path of the PDF file.
 * @param page - The page last read, 1-based.
 *
 * @dispatches pdf:read-page:set
 */
export function setPdfReadPage(path: string, page: number): void {
  // Record the page in the store
  PdfReadPagesStore.set({ path, page });

  // Dispatch read page set event
  Events.dispatch(PdfReadPageSetEvent, { path, page });
}
