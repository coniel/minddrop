export class FileReferenceNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FileReferenceNotFoundError);
    }

    this.name = 'FileReferenceNotFoundError';
    Object.setPrototypeOf(this, FileReferenceNotFoundError.prototype);
  }
}
