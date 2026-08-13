export class DesignRoleNotRegisteredError extends Error {
  /**
   * @param id - The ID of the design role that is not registered.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DesignRoleNotRegisteredError);
    }

    this.name = 'DesignRoleNotRegisteredError';
    this.message = `Design role '${id}' is not registered.`;

    Object.setPrototypeOf(this, DesignRoleNotRegisteredError.prototype);
  }
}
