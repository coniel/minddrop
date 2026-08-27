import {
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
  TextColorToken,
} from '../tokens';
import { PropertyChromeStyles } from './PropertyChromeStyles';
import {
  BackgroundEmphasis,
  BorderBlockStyle,
  MarginStyle,
  MaxWidthStyle,
  PaddingStyle,
} from './blocks';

/**
 * Styles for input field elements: the typography of the value
 * being edited plus the chrome of the field box around it.
 */
export interface FieldStyle
  extends PaddingStyle,
    MarginStyle,
    BorderBlockStyle,
    MaxWidthStyle,
    PropertyChromeStyles {
  /**
   * The text colour step of the field value.
   */
  color?: TextColorToken;

  /**
   * The font family of the field value.
   */
  fontFamily?: FontFamilyToken;

  /**
   * The font size step of the field value.
   */
  fontSize?: FontSizeToken;

  /**
   * The font weight of the field value.
   */
  fontWeight?: FontWeightToken;

  /**
   * The line height step of the field value.
   */
  lineHeight?: LineHeightToken;

  /**
   * How strongly the field box fills its background. Omitted, the
   * field renders no background of its own.
   */
  background?: BackgroundEmphasis;
}
