export class DataTypeNotFoundError extends Error {
  /**
   * @param type - The type of the data type that was not found.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataTypeNotFoundError);
    }

    this.name = 'DataTypeNotFoundError';
    this.message = `no data type '${type}' found.`;

    Object.setPrototypeOf(this, DataTypeNotFoundError.prototype);
  }
}
