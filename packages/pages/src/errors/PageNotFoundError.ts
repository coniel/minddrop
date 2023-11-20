export class PageNotFoundError extends Error {
  /**
   * @param path - The path to the page that does not exist.
   */
  constructor(path: string) {
    const message = `Page ${path} does not exist.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PageNotFoundError);
    }

    this.name = 'PageNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, PageNotFoundError.prototype);
  }
}
