export class CollectionTypeNotRegisteredError extends Error {
  /**
   * @param type - The type of collection that is not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CollectionTypeNotRegisteredError);
    }

    this.name = 'CollectionTypeNotRegisteredError';
    this.message = `no collection type '${type}' is registered.`;

    Object.setPrototypeOf(this, CollectionTypeNotRegisteredError.prototype);
  }
}
