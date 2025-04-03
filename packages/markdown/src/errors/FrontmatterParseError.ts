export class FrontmatterParseError extends Error {
  /**
   * @param markdown - The markdown content.
   */
  constructor(markdown: string) {
    const message = `Failed to parse YAML frontmatter from: ${markdown}`;

    super(markdown);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FrontmatterParseError);
    }

    this.name = 'FrontmatterParseError';
    this.message = message;

    Object.setPrototypeOf(this, FrontmatterParseError.prototype);
  }
}
