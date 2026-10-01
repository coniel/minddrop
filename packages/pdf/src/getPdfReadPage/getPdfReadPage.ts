import { PdfReadPagesStore } from '../PdfReadPagesStore';

/**
 * Returns the page of a document last read.
 *
 * @param path - The absolute path of the PDF file.
 * @returns The page last read, 1-based, or null when none is recorded.
 */
export function getPdfReadPage(path: string): number | null {
  return PdfReadPagesStore.get(path)?.page ?? null;
}
