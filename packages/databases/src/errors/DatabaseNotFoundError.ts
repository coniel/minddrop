export class DatabaseNotFoundError extends Error {
  /**
   * @param name - The name of the database that was not found.
   */
  constructor(name: string) {
    super(name);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseNotFoundError);
    }

    this.name = 'DatabaseNotFoundError';
    this.message = `no database with name '${name}' found.`;

    Object.setPrototypeOf(this, DatabaseNotFoundError.prototype);
  }
}
