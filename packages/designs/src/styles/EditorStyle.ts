import { FontFamilyToken, TextColorToken } from '../tokens';
import { TypographyStyle } from './TypographyStyle';
import {
  BorderBlockStyle,
  MarginStyle,
  PaddingStyle,
  WidthStyle,
} from './blocks';

/**
 * Styles for rich content editor elements. The title bar above the
 * editor body is styled through the nested `title` typography.
 */
export interface EditorStyle
  extends PaddingStyle,
    MarginStyle,
    BorderBlockStyle,
    WidthStyle {
  /**
   * The font family of the editor content.
   */
  fontFamily?: FontFamilyToken;

  /**
   * The text color role of the editor content.
   */
  color?: TextColorToken;

  /**
   * The typography of the editor's title bar.
   */
  title?: TypographyStyle;
}
