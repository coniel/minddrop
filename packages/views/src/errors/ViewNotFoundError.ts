export class ViewNotFoundError extends Error {
  /**
   * @param id - The ID of the view type that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewNotFoundError);
    }

    this.name = 'ViewNotFoundError';
    this.message = `View with ID ${id} not found`;

    Object.setPrototypeOf(this, ViewNotFoundError.prototype);
  }
}
