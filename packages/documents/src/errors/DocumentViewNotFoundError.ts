export class DocumentViewNotFoundError extends Error {
  /**
   * @param id - The ID to the document that does not exist.
   */
  constructor(id: string) {
    const message = `DocumentView ${id} does not exist.`;

    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentViewNotFoundError);
    }

    this.name = 'DocumentViewNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentViewNotFoundError.prototype);
  }
}
