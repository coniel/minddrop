/**
 * A request to bring an annotation forward in a document. Each new
 * request object is a new request, even for the same annotation.
 */
export interface PdfAnnotationFocusRequest {
  /**
   * The absolute path of the PDF file the annotation belongs to.
   */
  path: string;

  /**
   * The ID of the annotation to bring forward.
   */
  annotationId: string;
}
