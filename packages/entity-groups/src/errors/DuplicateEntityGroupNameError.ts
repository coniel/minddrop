export class DuplicateEntityGroupNameError extends Error {
  /**
   * @param name - The name another group of the type already has.
   */
  constructor(name: string) {
    super(name);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateEntityGroupNameError);
    }

    this.name = 'DuplicateEntityGroupNameError';
    this.message = `an entity group named '${name}' already exists.`;

    Object.setPrototypeOf(this, DuplicateEntityGroupNameError.prototype);
  }
}
