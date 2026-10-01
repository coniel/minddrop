import { createObjectStore } from '@minddrop/stores';
import { PdfDocumentReadPage } from './types';

export const PdfReadPagesStore = createObjectStore<PdfDocumentReadPage>(
  'Pdf:ReadPages',
  'path',
  { scope: 'workspace' },
);

/**
 * Returns the page of a document last read, null until one is
 * recorded or loaded.
 *
 * @param path - The absolute path of the PDF file.
 * @returns The page last read, 1-based, or null.
 */
export function usePdfReadPage(path: string): number | null {
  return PdfReadPagesStore.useItem(path)?.page ?? null;
}
