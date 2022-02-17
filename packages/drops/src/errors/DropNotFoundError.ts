export class DropNotFoundError extends Error {
  /**
   * @param dropId The ID of the drop which was not found.
   */
  constructor(dropId: string | string[]) {
    const ids = Array.isArray(dropId)
      ? dropId.map((id) => `'${id}'`).join(', ')
      : `'${dropId}'`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropNotFoundError);
    }

    this.name = 'DropNotFoundError';
    this.message = `drop${
      Array.isArray(dropId) && dropId.length > 1
        ? `s ${ids} do`
        : ` ${ids} does`
    } not exist.`;

    Object.setPrototypeOf(this, DropNotFoundError.prototype);
  }
}
