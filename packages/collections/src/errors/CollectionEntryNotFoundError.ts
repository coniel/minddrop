export class CollectionEntryNotFoundError extends Error {
  /**
   * @param path - The collection entry path.
   */
  constructor(path: string) {
    const message = `Collection entry ${path} does not exist.`;

    super(`${message}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CollectionEntryNotFoundError);
    }

    this.name = 'CollectionEntryNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, CollectionEntryNotFoundError.prototype);
  }
}
