export class RichTextElementNotFoundError extends Error {
  /**
   * @param elementId The element id(s).
   */
  constructor(elementId: string | string[]) {
    const ids = Array.isArray(elementId)
      ? elementId.map((id) => `'${id}'`).join(', ')
      : `'${elementId}'`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RichTextElementNotFoundError);
    }

    this.name = 'RichTextElementNotFoundError';
    this.message = `rich text element${
      Array.isArray(elementId) && elementId.length > 1
        ? `s ${ids} do`
        : ` ${ids} does`
    } not exist.`;

    Object.setPrototypeOf(this, RichTextElementNotFoundError.prototype);
  }
}
