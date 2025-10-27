export class ItemTypeAlreadyExistsError extends Error {
  /**
   * @param type - The type of item that already exists.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemTypeAlreadyExistsError);
    }

    this.name = 'ItemTypeAlreadyExistsError';
    this.message = `an item type with the name "${type}" already exists.`;

    Object.setPrototypeOf(this, ItemTypeAlreadyExistsError.prototype);
  }
}
