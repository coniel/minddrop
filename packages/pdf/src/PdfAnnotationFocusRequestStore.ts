import { createVanillaStore, useStore } from '@minddrop/stores';
import { AnnotationFocusRequestTimeoutMs } from './constants';
import { PdfAnnotationFocusRequest } from './types';

interface PdfAnnotationFocusRequestState {
  /**
   * The pending focus request, null while there is none.
   */
  request: PdfAnnotationFocusRequest | null;
}

// A single slot, so that a new request replaces a pending one
const PdfAnnotationFocusRequestStore =
  createVanillaStore<PdfAnnotationFocusRequestState>(() => ({
    request: null,
  }));

// The timer expiring the pending request
let expiryTimeout: ReturnType<typeof setTimeout> | undefined;

/**
 * Sets the pending annotation focus request, replacing any pending
 * one, and starts its expiry timer.
 *
 * @param request - The focus request.
 */
export function setPdfAnnotationFocusRequest(
  request: PdfAnnotationFocusRequest,
): void {
  // Cancel the pending request's expiry
  clearTimeout(expiryTimeout);

  // Replace the pending request
  PdfAnnotationFocusRequestStore.setState({ request });

  // Expire the request
  expiryTimeout = setTimeout(
    clearPdfAnnotationFocusRequest,
    AnnotationFocusRequestTimeoutMs,
  );
}

/**
 * Clears the pending annotation focus request.
 */
export function clearPdfAnnotationFocusRequest(): void {
  clearTimeout(expiryTimeout);

  PdfAnnotationFocusRequestStore.setState({ request: null });
}

/**
 * Watches the pending annotation focus request for a document. Each
 * request is a new object. A repeated request returns a new object,
 * even while the first is pending.
 *
 * @param path - The absolute path of the PDF file.
 * @returns The focus request, or null while none applies.
 */
export function usePdfAnnotationFocusRequest(
  path: string,
): PdfAnnotationFocusRequest | null {
  return useStore(PdfAnnotationFocusRequestStore, (state) =>
    state.request?.path === path ? state.request : null,
  );
}
