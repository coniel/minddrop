export class SpaceNotFoundError extends Error {
  /**
   * @param id - The ID of the space that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpaceNotFoundError);
    }

    this.name = 'SpaceNotFoundError';
    this.message = `no space with ID '${id}' found.`;

    Object.setPrototypeOf(this, SpaceNotFoundError.prototype);
  }
}
