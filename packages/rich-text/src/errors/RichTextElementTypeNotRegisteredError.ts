export class RichTextElementTypeNotRegisteredError extends Error {
  /**
   * @param type The element type.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextElementTypeNotRegisteredError);
    }

    this.name = 'RichTextElementTypeNotRegisteredError';
    this.message = `rich text element type '${type}' is not registered. All rich text element types need to be registered using the \`RichTextElements.register\` method before use.`;

    Object.setPrototypeOf(
      this,
      RichTextElementTypeNotRegisteredError.prototype,
    );
  }
}
