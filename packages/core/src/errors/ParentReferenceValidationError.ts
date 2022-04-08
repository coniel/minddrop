export class ParentReferenceValidationError extends Error {
  /**
   * @param reason The reason for which the element failed validation.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParentReferenceValidationError);
    }

    this.name = 'ParentReferenceValidationError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, ParentReferenceValidationError.prototype);
  }
}
