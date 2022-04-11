export class InvalidValidatorError extends Error {
  /**
   * @param reason The reason for which the validator is invalid.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidValidatorError);
    }

    this.name = 'InvalidValidatorError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, InvalidValidatorError.prototype);
  }
}
