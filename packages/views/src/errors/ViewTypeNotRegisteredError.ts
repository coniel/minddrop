export class ViewTypeNotRegisteredError extends Error {
  /**
   * @param type - The type of the view type that was not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewTypeNotRegisteredError);
    }

    this.name = 'ViewTypeNotRegisteredError';
    this.message = `no view type with type '${type}' is registered`;

    Object.setPrototypeOf(this, ViewTypeNotRegisteredError.prototype);
  }
}
