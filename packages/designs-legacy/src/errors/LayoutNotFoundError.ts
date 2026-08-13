export class LayoutNotFoundError extends Error {
  /**
   * @param id - The ID of the layout that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LayoutNotFoundError);
    }

    this.name = 'LayoutNotFoundError';
    this.message = `Layout with ID ${id} not found.`;

    Object.setPrototypeOf(this, LayoutNotFoundError.prototype);
  }
}
