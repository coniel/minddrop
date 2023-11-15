export class PathConflictError extends Error {
  /**
   * @param path - The file/dir path.
   */
  constructor(path: string) {
    const message = `Path ${path} already exists.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PathConflictError);
    }

    this.name = 'PathConflictError';
    this.message = message;

    Object.setPrototypeOf(this, PathConflictError.prototype);
  }
}
