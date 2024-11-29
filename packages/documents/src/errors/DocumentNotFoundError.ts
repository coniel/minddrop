export class DocumentNotFoundError extends Error {
  /**
   * @param id - The ID to the document that does not exist.
   */
  constructor(id: string) {
    const message = `Document ${id} does not exist.`;

    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentNotFoundError);
    }

    this.name = 'DocumentNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentNotFoundError.prototype);
  }
}
