export interface TextElement {
  /**
   * The actual text content.
   */
  text: string;

  /**
   * Whether the text is bolded.
   */
  bold?: boolean;

  /**
   * The markdown syntax used to bold the text (e.g. '**').
   */
  boldSyntax?: string;

  /**
   * Whether the text is italicized.
   */
  italic?: boolean;

  /**
   * The markdown syntax used to italicize the text (e.g. '_').
   */
  italicSyntax?: string;

  /**
   * Whether the text is struck through.
   */
  strikethrough?: boolean;

  /**
   * The markdown syntax used to strike through the text (e.g. '~~').
   */
  strikethroughSyntax?: string;

  /**
   * Whether the text is underlined.
   */
  underline?: boolean;

  /**
   * The markdown syntax used to underline the text (e.g. '<u>').
   */
  underlineSyntax?: string;

  /**
   * Whether the text is code style.
   */
  code?: boolean;

  /**
   * The markdown syntax used to code style the text (e.g. '``').
   */
  codeSyntax?: string;

  /**
   * Text nodes should not have a type property.
   */
  type?: never;
}
