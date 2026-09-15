export class ContentViewNotFoundError extends Error {
  /**
   * @param id - The ID of the content view type that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentViewNotFoundError);
    }

    this.name = 'ContentViewNotFoundError';
    this.message = `ContentView with ID ${id} not found`;

    Object.setPrototypeOf(this, ContentViewNotFoundError.prototype);
  }
}
