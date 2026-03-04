export class PageNotFoundError extends Error {
  /**
   * @param id - The ID of the page that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageNotFoundError);
    }

    this.name = 'PageNotFoundError';
    this.message = `no page with ID '${id}' found.`;

    Object.setPrototypeOf(this, PageNotFoundError.prototype);
  }
}
