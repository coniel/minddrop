export class CustomContentTypeNotFoundError extends Error {
  /**
   * @param id - The ID of the custom content type that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomContentTypeNotFoundError);
    }

    this.name = 'CustomContentTypeNotFoundError';
    this.message = `no custom content type with ID '${id}' found.`;

    Object.setPrototypeOf(this, CustomContentTypeNotFoundError.prototype);
  }
}
