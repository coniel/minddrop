export class RichTextElementValidationError extends Error {
  /**
   * @param reason The reason for which the element failed validation.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextElementValidationError);
    }

    this.name = 'RichTextElementValidationError';
    this.message = reason;

    Object.setPrototypeOf(this, RichTextElementValidationError.prototype);
  }
}
