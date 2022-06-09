export class ResourceNotRegisteredError extends Error {
  /**
   * @param resource - The resource which is not registered.
   */
  constructor(resource: string) {
    super(resource);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotRegisteredError);
    }

    this.name = 'ResourceNotRegisteredError';
    this.message = `resource '${resource}' is not registered`;

    Object.setPrototypeOf(this, ResourceNotRegisteredError.prototype);
  }
}
