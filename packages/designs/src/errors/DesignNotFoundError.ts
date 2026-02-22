export class DesignNotFoundError extends Error {
  /**
   * @param id - The ID of the design that was not found.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DesignNotFoundError);
    }

    this.name = 'DesignNotFoundError';
    this.message = `Design with ID ${type} not found.`;

    Object.setPrototypeOf(this, DesignNotFoundError.prototype);
  }
}
