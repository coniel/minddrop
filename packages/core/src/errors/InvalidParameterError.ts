export class InvalidParameterError extends Error {
  /**
   * @param reason - The reason for which the parameter is invalid.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidParameterError);
    }

    this.name = 'InvalidParameterError';
    this.message = reason;

    Object.setPrototypeOf(this, InvalidParameterError.prototype);
  }
}
