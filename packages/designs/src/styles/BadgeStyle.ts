import {
  FontSizeToken,
  FontWeightToken,
  RadiusToken,
  SpaceToken,
  SurfaceColorToken,
  TextColorToken,
} from '../tokens';
import { TextTransform } from './blocks';
import {
  BorderColor,
  BorderEmphasis,
  BorderLineStyle,
  MarginStyle,
} from './blocks';

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
   * The border colour treatment.
   */
  borderColor?: BorderColor;

  /**
   * How strongly the border colour applies.
   */
  borderEmphasis?: BorderEmphasis;

  /**
   * The corner radius. `full` renders pills.
   */
  borderRadius?: RadiusToken;

  /**
   * The uniform inner padding.
   */
  padding?: SpaceToken;
}
