export class EntryFileUnreadableError extends Error {
  /**
   * @param path - The path of the entry file which could not be read.
   */
  constructor(path: string) {
    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntryFileUnreadableError);
    }

    this.name = 'EntryFileUnreadableError';
    this.message = `entry file '${path}' could not be read, so it was not overwritten.`;

    Object.setPrototypeOf(this, EntryFileUnreadableError.prototype);
  }
}
