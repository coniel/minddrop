export class EntityGroupNotFoundError extends Error {
  /**
   * @param id - The ID of the group that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EntityGroupNotFoundError);
    }

    this.name = 'EntityGroupNotFoundError';
    this.message = `no entity group matching '${id}' found.`;

    Object.setPrototypeOf(this, EntityGroupNotFoundError.prototype);
  }
}
