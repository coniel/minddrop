export class GetImageDimensionsError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GetImageDimensionsError);
    }

    this.name = 'GetImageDimensionsError';
    Object.setPrototypeOf(this, GetImageDimensionsError.prototype);
  }
}
