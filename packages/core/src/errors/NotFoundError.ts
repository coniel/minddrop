export class NotFoundError extends Error {
  /**
   * @param name - The resource name.
   * @param id - The resource id(s).
   */
  constructor(name: string, id: string | string[]) {
    const ids = Array.isArray(id)
      ? id.map((singleId) => `'${singleId}'`).join(', ')
      : `'${id}'`;

    const message = `[${name}]${
      Array.isArray(id) && id.length > 1 ? `s ${ids} do` : ` ${ids} does`
    } not exist.`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = 'NotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
