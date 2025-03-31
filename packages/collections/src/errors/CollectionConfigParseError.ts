export class CollectionConfigParseError extends Error {
  /**
   * @param path - The collection path.
   */
  constructor(path: string) {
    const message = `Failed to parse collection config: ${path}.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CollectionConfigParseError);
    }

    this.name = 'CollectionConfigParseError';
    this.message = message;

    Object.setPrototypeOf(this, CollectionConfigParseError.prototype);
  }
}
