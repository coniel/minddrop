export class ViewNotRegisteredError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewNotRegisteredError);
    }

    this.name = 'ViewNotRegisteredError';
    Object.setPrototypeOf(this, ViewNotRegisteredError.prototype);
  }
}
