export class MarkdownParseError extends Error {
  /**
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MarkdownParseError);
    }

    this.name = 'MarkdownParseError';
    this.message = message;

    Object.setPrototypeOf(this, MarkdownParseError.prototype);
  }
}
