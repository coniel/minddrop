export class DocumentParseError extends Error {
  /**
   * @param path - The path to the document that could not be parsed.
   */
  constructor(path: string) {
    const message = `Failed to parse document ${path}.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentParseError);
    }

    this.name = 'DocumentParseError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentParseError.prototype);
  }
}
