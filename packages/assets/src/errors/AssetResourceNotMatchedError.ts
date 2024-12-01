export class AssetResourceNotMatchedError extends Error {
  /**
   * @param id - The ID to the asset which could not be matched by any handler.
   */
  constructor(id: string) {
    const message = `No asset handler matched the given resource ID: ${id}`;

    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssetResourceNotMatchedError);
    }

    this.name = 'AssetResourceNotMatchedError';
    this.message = message;

    Object.setPrototypeOf(this, AssetResourceNotMatchedError.prototype);
  }
}
