export class ResourceDocumentNotFoundError extends Error {
  /**
   * @param resource The resource name.
   * @param documentId The document id(s).
   */
  constructor(resource: string, documentId: string | string[]) {
    const ids = Array.isArray(documentId)
      ? documentId.map((id) => `'${id}'`).join(', ')
      : `'${documentId}'`;

    const message = `[${resource}] document${
      Array.isArray(documentId) && documentId.length > 1
        ? `s ${ids} do`
        : ` ${ids} does`
    } not exist.`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceDocumentNotFoundError);
    }

    this.name = 'ResourceDocumentNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, ResourceDocumentNotFoundError.prototype);
  }
}
