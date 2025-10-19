export class ItemTypeInstanceNotFoundError extends Error {
  /**
   * @param id - The ID of the instance that was not found.
   */
  constructor(id: string) {
    const message = `Item type instance ${id} does not exist.`;

    super(`${message}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemTypeInstanceNotFoundError);
    }

    this.name = 'ItemNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, ItemTypeInstanceNotFoundError.prototype);
  }
}
