export class DatabaseEntryNotFoundError extends Error {
  /**
   * @param id - The ID of the database entry that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseEntryNotFoundError);
    }

    this.name = 'DatabaseEntryNotFoundError';
    this.message = `no entry with ID '${id}' found.`;

    Object.setPrototypeOf(this, DatabaseEntryNotFoundError.prototype);
  }
}
