export class ExtensionDocumentNotFoundError extends Error {
  /**
   * @param extensionId The ID of the extension for which the document was not found.
   */
  constructor(extensionId: string) {
    super(extensionId);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExtensionDocumentNotFoundError);
    }

    this.name = 'ExtensionDocumentNotFoundError';
    this.message = `no ExtensionDocument found for extension '${extensionId}'.`;

    Object.setPrototypeOf(this, ExtensionDocumentNotFoundError.prototype);
  }
}
