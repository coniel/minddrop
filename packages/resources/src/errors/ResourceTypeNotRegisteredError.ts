export class ResourceTypeNotRegisteredError extends Error {
  /**
   * @param resource - The resource for which the type is not registered.
   * @param type - The resource type which is not registered.
   */
  constructor(resource: string, type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceTypeNotRegisteredError);
    }

    this.name = 'ResourceTypeNotRegisteredError';
    this.message = `[${resource}] type '${type}' is not registered`;

    Object.setPrototypeOf(this, ResourceTypeNotRegisteredError.prototype);
  }
}
