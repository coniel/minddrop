export class ElementTypeNotRegisteredError extends Error {
  /**
   * @param type - The element type that is not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ElementTypeNotRegisteredError);
    }

    this.name = 'ElementTypeNotRegisteredError';
    this.message = `Element type '${type}' is not registered.`;

    Object.setPrototypeOf(this, ElementTypeNotRegisteredError.prototype);
  }
}
