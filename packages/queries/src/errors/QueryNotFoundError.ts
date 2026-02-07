export class QueryNotFoundError extends Error {
  /**
   * @param id - The ID of the query that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryNotFoundError);
    }

    this.name = 'QueryNotFoundError';
    this.message = `no query with ID '${id}' found.`;

    Object.setPrototypeOf(this, QueryNotFoundError.prototype);
  }
}
