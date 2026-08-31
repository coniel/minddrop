export class TagGroupNotFoundError extends Error {
  /**
   * @param identifier - The ID or name of the tag group that was not found.
   */
  constructor(identifier: string) {
    super(identifier);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TagGroupNotFoundError);
    }

    this.name = 'TagGroupNotFoundError';
    this.message = `no tag group matching '${identifier}' found.`;

    Object.setPrototypeOf(this, TagGroupNotFoundError.prototype);
  }
}
