export class DataViewNotFoundError extends Error {
  /**
   * @param id - The ID of the data view type that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataViewNotFoundError);
    }

    this.name = 'DataViewNotFoundError';
    this.message = `DataView with ID ${id} not found`;

    Object.setPrototypeOf(this, DataViewNotFoundError.prototype);
  }
}
