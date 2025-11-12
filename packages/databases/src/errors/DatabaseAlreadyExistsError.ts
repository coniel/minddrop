export class DatabaseAlreadyExistsError extends Error {
  /**
   * @param name - The type of item that already exists.
   */
  constructor(name: string) {
    super(name);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseAlreadyExistsError);
    }

    this.name = 'DatabaseAlreadyExistsError';
    this.message = `a database with the name '${name}' already exists.`;

    Object.setPrototypeOf(this, DatabaseAlreadyExistsError.prototype);
  }
}
