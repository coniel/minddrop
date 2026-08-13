import {
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  LetterSpacingToken,
  LineHeightToken,
  TextColorToken,
} from '../tokens';
import { MarginStyle, WidthStyle } from './blocks';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';

/**
 * Styles for text-rendering elements. Every value resolves through
 * the theme; omitted values inherit.
 */
export interface TypographyStyle extends MarginStyle, WidthStyle {
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
   * The text color role.
   */
  color?: TextColorToken;

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
   * Whether the text renders underlined.
   */
  underline?: boolean;

  /**
   * The maximum number of lines rendered before truncating with an
   * ellipsis. Omitted or 0, the text does not truncate.
   */
  truncate?: number;
}
