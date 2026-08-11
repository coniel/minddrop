export class AutomationNotFoundError extends Error {
  /**
   * @param id - The ID of the automation that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AutomationNotFoundError);
    }

    this.name = 'AutomationNotFoundError';
    this.message = `no automation with ID '${id}' found.`;

    Object.setPrototypeOf(this, AutomationNotFoundError.prototype);
  }
}
