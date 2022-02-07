export class ViewInstanceNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewInstanceNotFoundError);
    }

    this.name = 'ViewInstanceNotFoundError';
    Object.setPrototypeOf(this, ViewInstanceNotFoundError.prototype);
  }
}
