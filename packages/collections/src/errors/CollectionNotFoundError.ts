export class CollectionNotFoundError extends Error {
  /**
   * @param id - The ID of the collection that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CollectionNotFoundError);
    }

    this.name = 'CollectionNotFoundError';
    this.message = `no collection with ID '${id}' found.`;

    Object.setPrototypeOf(this, CollectionNotFoundError.prototype);
  }
}
