import { ContentColor } from '@minddrop/core';

export interface RichText {
  /**
   * The actual text content.
   */
  text: string;

  /**
   * The color of the text.
   */
  color?: ContentColor;

  /**
   * The background color of the text.
   */
  backgroundColor?: ContentColor;

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
}
