export class ParseError extends Error {
  /**
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }

    this.name = 'ParseError';
    this.message = message;

    Object.setPrototypeOf(this, ParseError.prototype);
  }
}
