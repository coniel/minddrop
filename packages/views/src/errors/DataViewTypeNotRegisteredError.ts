export class DataViewTypeNotRegisteredError extends Error {
  /**
   * @param type - The type of the data view type that was not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataViewTypeNotRegisteredError);
    }

    this.name = 'DataViewTypeNotRegisteredError';
    this.message = `no view type with type '${type}' is registered`;

    Object.setPrototypeOf(this, DataViewTypeNotRegisteredError.prototype);
  }
}
