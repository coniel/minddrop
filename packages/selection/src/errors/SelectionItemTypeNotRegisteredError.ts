export class SelectionItemTypeNotRegisteredError extends Error {
  /**
   * @param id - The ID of the selection serializer that was not found.
   */
  constructor(jsonString: string) {
    const message = `No selection item type config found with ID: ${jsonString}`;

    super(jsonString);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SelectionItemTypeNotRegisteredError);
    }

    this.name = 'SelectionItemTypeNotRegisteredError';
    this.message = message;

    Object.setPrototypeOf(this, SelectionItemTypeNotRegisteredError.prototype);
  }
}
