export class EntryFileUnparseableError extends Error {
  /**
   * @param path - The path of the entry file which could not be parsed.
   */
  constructor(path: string) {
    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntryFileUnparseableError);
    }

    this.name = 'EntryFileUnparseableError';
    this.message = `entry file '${path}' could not be parsed, so it was not overwritten.`;

    Object.setPrototypeOf(this, EntryFileUnparseableError.prototype);
  }
}
