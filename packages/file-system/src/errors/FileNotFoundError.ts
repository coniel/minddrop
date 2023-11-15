export class FileNotFoundError extends Error {
  /**
   * @param name - The file name.
   */
  constructor(name: string) {
    const message = `File ${name} does not exist.`;

    super(name);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileNotFoundError);
    }

    this.name = 'FileNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, FileNotFoundError.prototype);
  }
}
