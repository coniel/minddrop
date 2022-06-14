export class SaveFileError extends Error {
  /**
   * @param reason - The reason for which the save failed.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SaveFileError);
    }

    this.name = 'SaveFileError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, SaveFileError.prototype);
  }
}
