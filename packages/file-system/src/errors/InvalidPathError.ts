export class InvalidPathError extends Error {
  /**
   * @param path - The file/dir path.
   */
  constructor(path: string) {
    const message = `Path ${path} does not exist.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPathError);
    }

    this.name = 'InvalidPathError';
    this.message = message;

    Object.setPrototypeOf(this, InvalidPathError.prototype);
  }
}
