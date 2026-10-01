import { setPdfAnnotationFocusRequest } from '../PdfAnnotationFocusRequestStore';

/**
 * Requests that the readers of a document bring one of its annotations
 * forward. The request is picked up by readers which mount while it is
 * pending, expires shortly after being made, and replaces any pending
 * request.
 *
 * @param path - The absolute path of the PDF file.
 * @param annotationId - The ID of the annotation to bring forward.
 */
export function requestPdfAnnotationFocus(
  path: string,
  annotationId: string,
): void {
  setPdfAnnotationFocusRequest({ path, annotationId });
}
