export class ViewNotFoundError extends Error {
  /**
   * @param id - The ID of the view that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewNotFoundError);
    }

    this.name = 'ViewNotFoundError';
    this.message = `no view with ID '${id}' found.`;

    Object.setPrototypeOf(this, ViewNotFoundError.prototype);
  }
}
