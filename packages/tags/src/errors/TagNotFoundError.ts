export class TagNotFoundError extends Error {
  /**
   * @param tagId The tag id(s).
   */
  constructor(tagId: string | string[]) {
    const ids = Array.isArray(tagId)
      ? tagId.map((id) => `'${id}'`).join(', ')
      : `'${tagId}'`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TagNotFoundError);
    }

    this.name = 'TagNotFoundError';
    this.message = `tag${
      Array.isArray(tagId) && tagId.length > 1 ? `s ${ids} do` : ` ${ids} does`
    } not exist.`;

    Object.setPrototypeOf(this, TagNotFoundError.prototype);
  }
}
