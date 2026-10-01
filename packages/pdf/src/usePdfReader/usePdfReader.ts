import { useEffect } from 'react';
import { registerPdfReader } from '../registerPdfReader';

/**
 * Registers the calling component as a reader showing a document in a
 * view area, for as long as it renders. Registers nothing without a
 * path or a view area.
 *
 * @param path - The absolute path of the PDF file, null for none.
 * @param viewAreaId - The ID of the view area the reader renders in, null for none.
 */
export function usePdfReader(
  path: string | null,
  viewAreaId: string | null,
): void {
  // Register the reader for as long as it renders
  useEffect(() => {
    if (!path || !viewAreaId) {
      return;
    }

    // Register the reader, removing it on cleanup
    return registerPdfReader({ path, viewAreaId });
  }, [path, viewAreaId]);
}
