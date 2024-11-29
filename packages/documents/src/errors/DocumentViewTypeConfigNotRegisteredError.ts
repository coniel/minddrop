export class DocumentViewTypeConfigNotRegisteredError extends Error {
  /**
   * @param id - The ID to the view type that is not registered.
   */
  constructor(id: string) {
    const message = `Document view type ${id} is not registered.`;

    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentViewTypeConfigNotRegisteredError);
    }

    this.name = 'DocumentViewTypeConfigNotRegisteredError';
    this.message = message;

    Object.setPrototypeOf(
      this,
      DocumentViewTypeConfigNotRegisteredError.prototype,
    );
  }
}
