export class ItemNotFoundError extends Error {
  /**
   * @param path - The item path.
   */
  constructor(path: string) {
    const message = `Item ${path} does not exist.`;

    super(`${message}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemNotFoundError);
    }

    this.name = 'ItemNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, ItemNotFoundError.prototype);
  }
}
