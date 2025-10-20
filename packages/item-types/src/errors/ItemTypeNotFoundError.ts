export class ItemTypeNotFoundError extends Error {
  /**
   * @param type - The type of item that could not be found.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemTypeNotFoundError);
    }

    this.name = 'ItemTypeNotFoundError';
    this.message = `no item type '${type}' found.`;

    Object.setPrototypeOf(this, ItemTypeNotFoundError.prototype);
  }
}
