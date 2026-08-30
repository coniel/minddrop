export class TagNotFoundError extends Error {
  /**
   * @param identifier - The ID or name of the tag that was not found.
   */
  constructor(identifier: string) {
    super(identifier);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TagNotFoundError);
    }

    this.name = 'TagNotFoundError';
    this.message = `no tag matching '${identifier}' found.`;

    Object.setPrototypeOf(this, TagNotFoundError.prototype);
  }
}
