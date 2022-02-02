export class DropTypeNotRegisteredError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropTypeNotRegisteredError);
    }

    this.name = 'DropTypeNotRegisteredError';
    Object.setPrototypeOf(this, DropTypeNotRegisteredError.prototype);
  }
}
