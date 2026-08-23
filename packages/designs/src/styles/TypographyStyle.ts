import {
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  LetterSpacingToken,
  LineHeightToken,
  TextColorToken,
} from '../tokens';
import { MarginStyle, MaxWidthStyle, TextTransform } from './blocks';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Styles for text-rendering elements. Every value resolves through
 * the theme; omitted values inherit.
 */
export interface TypographyStyle extends MarginStyle, MaxWidthStyle {
  /**
   * The text colour step. Omitted, the text renders regular.
   */
  color?: TextColorToken;

  /**
   * The font family.
   */
  fontFamily?: FontFamilyToken;

  /**
   * The font size step.
   */
  fontSize?: FontSizeToken;

  /**
   * The font weight.
   */
  fontWeight?: FontWeightToken;

  /**
   * The line height step.
   */
  lineHeight?: LineHeightToken;

  /**
   * The letter spacing step.
   */
  letterSpacing?: LetterSpacingToken;

  /**
   * The horizontal text alignment.
   */
  textAlign?: TextAlign;

  /**
   * The text case transform.
   */
  textTransform?: TextTransform;

  /**
   * Whether the text renders italic.
   */
  italic?: boolean;

  /**
   * The maximum number of lines rendered before truncating with an
   * ellipsis. Omitted or 0, the text does not truncate.
   */
  truncate?: number;
}
