export class RichTextDocumentValidationError extends Error {
  /**
   * @param reason The reason for which the document failed validation.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextDocumentValidationError);
    }

    this.name = 'RichTextDocumentValidationError';
    this.message = reason;

    Object.setPrototypeOf(this, RichTextDocumentValidationError.prototype);
  }
}
