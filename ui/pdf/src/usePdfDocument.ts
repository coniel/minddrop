import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { useEffect, useState } from 'react';
import { PdfDocumentState } from './types';

// Point pdf.js at the worker it parses documents in. Resolved from
// the package's own build so that the bundler emits it as an asset.
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href;

// The state before a document loads
const UnloadedState: PdfDocumentState = {
  document: null,
  pageCount: 0,
  pageSize: null,
  error: null,
};

/**
 * Loads the PDF document at a source URL. The document is destroyed
 * when the source changes or on unmount.
 *
 * @param src - The URL the document is served at, or null for none.
 * @returns The document state.
 */
export function usePdfDocument(src: string | null): PdfDocumentState {
  const [state, setState] = useState<PdfDocumentState>(UnloadedState);

  // Load the document at the source
  useEffect(() => {
    // Reset to the unloaded state
    setState(UnloadedState);

    if (!src) {
      return;
    }

    // Whether the source changed meanwhile
    let cancelled = false;
    // Start loading the document
    const loadingTask = getDocument({ url: src });

    // Record the document once it loads, or the error it failed with
    loadingTask.promise
      .then(async (document) => {
        // Read the first page's size. It lays the document out before
        // the other pages report their own.
        const firstPage = await document.getPage(1);
        const { width, height } = firstPage.getViewport({ scale: 1 });

        // Check if the source changed meanwhile. If so, drop the
        // document.
        if (cancelled) {
          return;
        }

        // Record the loaded document
        setState({
          document,
          pageCount: document.numPages,
          pageSize: { width, height },
          error: null,
        });
      })
      .catch((error: Error) => {
        // Record the failure unless the source changed meanwhile
        if (!cancelled) {
          setState({ ...UnloadedState, error });
        }
      });

    return () => {
      // Drop whatever the load still yields
      cancelled = true;

      // Destroy the task, and with it the document it loaded
      loadingTask.destroy();
    };
  }, [src]);

  return state;
}
