export class BaseItemTypeNotFoundError extends Error {
  /**
   * @param type - The base item type that was not found.
   */
  constructor(type: string) {
    const message = `no base item type with type "${type}" found.`;

    super(`${message}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseItemTypeNotFoundError);
    }

    this.name = 'BaseItemTypeNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, BaseItemTypeNotFoundError.prototype);
  }
}
