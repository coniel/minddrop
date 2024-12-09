export class ParentDocumentNotFoundError extends Error {
  /**
   * @param resource - The resource type for which the parent document was not found.
   * @param id - The ID to the resource for which the parent document was not found.
   */
  constructor(resource: string, id: string) {
    const message = `Parent document not found for ${resource} with ID: ${id}`;

    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParentDocumentNotFoundError);
    }

    this.name = 'ParentDocumentNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, ParentDocumentNotFoundError.prototype);
  }
}
