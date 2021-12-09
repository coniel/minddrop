export class DropNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropNotFoundError);
    }

    this.name = 'DropNotFoundError';
    Object.setPrototypeOf(this, DropNotFoundError.prototype);
  }
}
