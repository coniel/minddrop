export class ProtectedEntityGroupError extends Error {
  /**
   * @param id - The ID of the protected group.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProtectedEntityGroupError);
    }

    this.name = 'ProtectedEntityGroupError';
    this.message = `entity group '${id}' is provided by the app and cannot be edited.`;

    Object.setPrototypeOf(this, ProtectedEntityGroupError.prototype);
  }
}
