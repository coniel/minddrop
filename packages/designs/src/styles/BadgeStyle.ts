import {
  FontSizeToken,
  FontWeightToken,
  RadiusToken,
  SpaceToken,
} from '../tokens';
import { PropertyChromeStyles } from './PropertyChromeStyles';
import { TextTransform } from './blocks';
import { MarginStyle } from './blocks';

/**
 * Styles for badge chips. A chip's fill and label colour come from
 * its select option, so they are not style values; its size,
 * rounding and padding are the chip shape its variant sets.
 */
export interface BadgeStyle extends MarginStyle, PropertyChromeStyles {
  /**
   * The font size step.
   */
  fontSize?: FontSizeToken;

  /**
   * The font weight.
   */
  fontWeight?: FontWeightToken;

  /**
   * The text case transform.
   */
  textTransform?: TextTransform;

  /**
   * The corner radius. `full` renders pills.
   */
  borderRadius?: RadiusToken;

  /**
   * The uniform inner padding.
   */
  padding?: SpaceToken;
}
