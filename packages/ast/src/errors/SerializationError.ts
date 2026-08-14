export class SerializationError extends Error {
  /**
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SerializationError);
    }

    this.name = 'SerializationError';
    this.message = message;

    Object.setPrototypeOf(this, SerializationError.prototype);
  }
}
