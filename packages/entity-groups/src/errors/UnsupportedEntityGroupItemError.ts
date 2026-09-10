export class UnsupportedEntityGroupItemError extends Error {
  /**
   * @param itemId - The ID of the item the group cannot hold.
   */
  constructor(itemId: string) {
    super(itemId);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnsupportedEntityGroupItemError);
    }

    this.name = 'UnsupportedEntityGroupItemError';
    this.message = `'${itemId}' is not of a type the group can hold.`;

    Object.setPrototypeOf(this, UnsupportedEntityGroupItemError.prototype);
  }
}
