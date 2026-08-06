export class DatabaseEntryTemplateNotFoundError extends Error {
  /**
   * @param id - The ID of the entry template that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseEntryTemplateNotFoundError);
    }

    this.name = 'DatabaseEntryTemplateNotFoundError';
    this.message = `no entry template with ID '${id}' found.`;

    Object.setPrototypeOf(this, DatabaseEntryTemplateNotFoundError.prototype);
  }
}
