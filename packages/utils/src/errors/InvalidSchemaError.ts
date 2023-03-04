export class InvalidSchemaError extends Error {
  /**
   * @param reason The reason for which the schema is invalid.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidSchemaError);
    }

    this.name = 'InvalidSchemaError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, InvalidSchemaError.prototype);
  }
}
