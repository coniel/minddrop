export interface TextElement
  extends Record<string, string | boolean | undefined> {
  /**
   * The actual text content.
   */
  text: string;

  /**
   * Whether the text is bolded.
   */
  bold?: boolean;

  /**
   * Whether the text is italicized.
   */
  italic?: boolean;

  /**
   * Whether the text is struck through.
   */
  strikethrough?: boolean;

  /**
   * Whether the text is underlined.
   */
  underline?: boolean;

  /**
   * Whether the text is code style.
   */
  code?: boolean;

  /**
   * Text nodes should not have a type property.
   */
  type?: never;
}
