import {
  FontFamilyToken,
  FontSizeToken,
  LineHeightToken,
  TextColorToken,
} from '../tokens';
import { TypographyStyle } from './TypographyStyle';
import {
  BorderBlockStyle,
  MarginStyle,
  MaxWidthStyle,
  PaddingStyle,
} from './blocks';

/**
 * Styles for rich content editor elements. The title bar above the
 * editor body is styled through the nested `title` typography.
 */
export interface EditorStyle
  extends PaddingStyle,
    MarginStyle,
    BorderBlockStyle,
    MaxWidthStyle {
  /**
   * The font family of the editor content.
   */
  fontFamily?: FontFamilyToken;

  /**
   * The base font size of the editor content.
   */
  fontSize?: FontSizeToken;

  /**
   * The base line height of the editor content.
   */
  lineHeight?: LineHeightToken;

  /**
   * The text colour step of the editor content.
   */
  color?: TextColorToken;

  /**
   * The typography of the editor's title bar.
   */
  title?: TypographyStyle;
}
