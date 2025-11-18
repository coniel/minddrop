export class DatabaseEntryNotFoundError extends Error {
  /**
   * @param path - The path of the database entry that was not found.
   */
  constructor(path: string) {
    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseEntryNotFoundError);
    }

    this.name = 'DatabaseEntryNotFoundError';
    this.message = `no entry with path '${path}' found.`;

    Object.setPrototypeOf(this, DatabaseEntryNotFoundError.prototype);
  }
}
