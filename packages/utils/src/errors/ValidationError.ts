export class ValidationError extends Error {
  /**
   * @param reason The reason for which the validation failed.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.name = 'ValidationError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
