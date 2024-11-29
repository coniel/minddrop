export class BlockNotFoundError extends Error {
  /**
   * @param id - The ID to the block that does not exist.
   */
  constructor(id: string) {
    const message = `Block ${id} does not exist.`;

    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockNotFoundError);
    }

    this.name = 'BlockNotFoundError';
    this.message = message;

    Object.setPrototypeOf(this, BlockNotFoundError.prototype);
  }
}
