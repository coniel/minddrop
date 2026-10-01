export class PdfAnnotationNotFoundError extends Error {
  /**
   * @param path - The absolute path of the PDF file the annotation was looked up on.
   * @param id - The ID of the annotation that was not found.
   */
  constructor(path: string, id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PdfAnnotationNotFoundError);
    }

    this.name = 'PdfAnnotationNotFoundError';
    this.message = `no annotation with ID '${id}' found on document '${path}'.`;

    Object.setPrototypeOf(this, PdfAnnotationNotFoundError.prototype);
  }
}
