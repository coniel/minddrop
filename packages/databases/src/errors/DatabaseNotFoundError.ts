export class DatabaseNotFoundError extends Error {
  /**
   * @param id - The ID of the database that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseNotFoundError);
    }

    this.name = 'DatabaseNotFoundError';
    this.message = `no database with ID '${id}' found.`;

    Object.setPrototypeOf(this, DatabaseNotFoundError.prototype);
  }
}
