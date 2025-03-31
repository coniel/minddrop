export class CollectionNotFoundError extends Error {
  /**
   * @param path - The collection path.
   */
  constructor(path: string) {
    const message = `Collection ${path} does not exist.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CollectionNotFoundError);
    }

    this.name = 'CollectionNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, CollectionNotFoundError.prototype);
  }
}
