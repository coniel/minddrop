export class TagNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TagNotFoundError);
    }

    this.name = 'TagNotFoundError';
    Object.setPrototypeOf(this, TagNotFoundError.prototype);
  }
}
