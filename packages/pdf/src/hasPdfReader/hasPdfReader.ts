import { PdfReadersStore } from '../PdfReadersStore';

/**
 * Checks whether a reader showing a document is mounted in a view
 * area.
 *
 * @param path - The absolute path of the PDF file.
 * @param viewAreaId - The ID of the view area.
 * @returns Whether a reader shows the document in the view area.
 */
export function hasPdfReader(path: string, viewAreaId: string): boolean {
  // Check if any reader of the document renders in the view area
  return PdfReadersStore.getState().readers.some(
    (reader) => reader.path === path && reader.viewAreaId === viewAreaId,
  );
}
