import {
  FontFamilyToken,
  FontSizeToken,
  LineHeightToken,
  TextColorToken,
} from '../tokens';
import {
  BorderBlockStyle,
  MarginStyle,
  MaxWidthStyle,
  PaddingStyle,
} from './blocks';

/**
 * Styles for the title bar above an editor's body. The variant
 * carries the title's typographic shape; only the colour is
 * styled per element.
 */
export interface EditorTitleStyle {
  /**
   * The title element presentation variant the title bar renders
   * at. Omitted or unknown, the title element's default applies.
   */
  variant?: string;

  /**
   * The title colour step. Omitted, the title renders regular.
   */
  color?: TextColorToken;
}

/**
 * Styles for rich content editor elements. The title bar above the
 * editor body is styled through the nested `title` style.
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
   * The styling of the editor's title bar.
   */
  title?: EditorTitleStyle;
}
