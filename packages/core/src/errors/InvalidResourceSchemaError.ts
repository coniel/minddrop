export class InvalidResourceSchemaError extends Error {
  /**
   * @param reason The reason for which the resource schema is invalid.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidResourceSchemaError);
    }

    this.name = 'InvalidResourceSchemaError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, InvalidResourceSchemaError.prototype);
  }
}
