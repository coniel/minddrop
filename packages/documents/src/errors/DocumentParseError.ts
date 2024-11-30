export class DocumentParseError extends Error {
  /**
   * @param jsonString - The path to the document that could not be parsed.
   */
  constructor(jsonString: string) {
    const message = `Failed to parse document ${jsonString}.`;

    super(jsonString);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentParseError);
    }

    this.name = 'DocumentParseError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentParseError.prototype);
  }
}
