import {
  BorderColorToken,
  FontSizeToken,
  FontWeightToken,
  RadiusToken,
  SpaceToken,
  SurfaceColorToken,
  TextColorToken,
} from '../tokens';
import { TextTransform } from './TypographyStyle';
import { BorderLineStyle, MarginStyle } from './blocks';

/**
 * Styles for badge chips. Solid background fills pair with the
 * `on-solid` text color role.
 */
export interface BadgeStyle extends MarginStyle {
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
   * The text color role.
   */
  color?: TextColorToken;

  /**
   * The background surface role.
   */
  background?: SurfaceColorToken;

  /**
   * The border line style. Omitted, no border is drawn.
   */
  borderStyle?: BorderLineStyle;

  /**
   * The border color role.
   */
  borderColor?: BorderColorToken;

  /**
   * The corner radius. `full` renders pills.
   */
  borderRadius?: RadiusToken;

  /**
   * The uniform inner padding.
   */
  padding?: SpaceToken;
}
