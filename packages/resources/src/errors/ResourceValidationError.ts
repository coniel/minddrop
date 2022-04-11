export class ResourceValidationError extends Error {
  /**
   * @param reason The reason for which the resource failed validation.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceValidationError);
    }

    this.name = 'ResourceValidationError';
    this.message = reason;

    Object.setPrototypeOf(this, ResourceValidationError.prototype);
  }
}
