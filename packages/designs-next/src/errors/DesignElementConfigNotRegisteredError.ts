export class DesignElementConfigNotRegisteredError extends Error {
  /**
   * @param type - The design element type that is not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DesignElementConfigNotRegisteredError);
    }

    this.name = 'DesignElementConfigNotRegisteredError';
    this.message = `Design element type '${type}' is not registered.`;

    Object.setPrototypeOf(
      this,
      DesignElementConfigNotRegisteredError.prototype,
    );
  }
}
