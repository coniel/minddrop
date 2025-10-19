export class ItemTypeNotRegisteredError extends Error {
  /**
   * @param type - The type of item that is not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemTypeNotRegisteredError);
    }

    this.name = 'ItemTypeNotRegisteredError';
    this.message = `no item type '${type}' is registered.`;

    Object.setPrototypeOf(this, ItemTypeNotRegisteredError.prototype);
  }
}
