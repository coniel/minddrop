export class DocumentNotFoundError extends Error {
  /**
   * @param path - The path to the document that does not exist.
   */
  constructor(path: string) {
    const message = `Document ${path} does not exist.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentNotFoundError);
    }

    this.name = 'DocumentNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentNotFoundError.prototype);
  }
}
