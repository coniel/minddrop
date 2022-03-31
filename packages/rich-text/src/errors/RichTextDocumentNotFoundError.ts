export class RichTextDocumentNotFoundError extends Error {
  /**
   * @param documentId The document id(s).
   */
  constructor(documentId: string | string[]) {
    const ids = Array.isArray(documentId)
      ? documentId.map((id) => `'${id}'`).join(', ')
      : `'${documentId}'`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextDocumentNotFoundError);
    }

    this.name = 'RichTextDocumentNotFoundError';
    this.message = `rich text document${
      Array.isArray(documentId) && documentId.length > 1
        ? `s ${ids} do`
        : ` ${ids} does`
    } not exist.`;

    Object.setPrototypeOf(this, RichTextDocumentNotFoundError.prototype);
  }
}
