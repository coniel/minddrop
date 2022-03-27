export class RichTextElementTypeAlreadyRegisteredError extends Error {
  /**
   * @param type The element type.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextElementTypeAlreadyRegisteredError);
    }

    this.name = 'RichTextElementTypeAlreadyRegisteredError';
    this.message = `Error registering rich text element, an element of type '${type}' is already registered.`;

    Object.setPrototypeOf(
      this,
      RichTextElementTypeAlreadyRegisteredError.prototype,
    );
  }
}
