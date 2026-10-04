export class EntryNotFoundError extends Error {
  /**
   * @param id - The ID of the database entry that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntryNotFoundError);
    }

    this.name = 'EntryNotFoundError';
    this.message = `no entry with ID '${id}' found.`;

    Object.setPrototypeOf(this, EntryNotFoundError.prototype);
  }
}
