export class DocumentTypeConfigNotFoundError extends Error {
  /**
   * @param fileType - The path to the document that does not exist.
   */
  constructor(fileType: string) {
    const message = `Document with file type ${fileType} is not registered.`;

    super(fileType);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentTypeConfigNotFoundError);
    }

    this.name = 'DocumentTypeConfigNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, DocumentTypeConfigNotFoundError.prototype);
  }
}
