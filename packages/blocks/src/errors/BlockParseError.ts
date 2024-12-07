export class BlockParseError extends Error {
  /**
   * @param jsonString - The path to the block that could not be parsed.
   */
  constructor(jsonString: string) {
    const message = `Failed to parse block ${jsonString}.`;

    super(jsonString);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockParseError);
    }

    this.name = 'BlockParseError';
    this.message = message;

    Object.setPrototypeOf(this, BlockParseError.prototype);
  }
}
