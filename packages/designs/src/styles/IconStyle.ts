import {
  IconSizeToken,
  RadiusToken,
  SpaceToken,
  TextColorToken,
} from '../tokens';
import { BackgroundEmphasis, MarginStyle } from './blocks';

/**
 * Styles for the box optionally rendered around an icon.
 */
export interface IconContainerStyle {
  /**
   * How strongly the box fill applies the surface. Omitted, the box
   * renders unfilled.
   */
  background?: BackgroundEmphasis;

  /**
   * The corner radius.
   */
  radius?: RadiusToken;

  /**
   * The uniform inner padding.
   */
  padding?: SpaceToken;
}

/**
 * Styles for icon elements. The text colour step colours the icon
 * glyph.
 */
export interface IconStyle extends MarginStyle {
  /**
   * The icon size step.
   */
  size?: IconSizeToken;

  /**
   * The icon colour step.
   */
  color?: TextColorToken;

  /**
   * The box rendered around the icon. Omitted, the icon renders
   * bare.
   */
  container?: IconContainerStyle;
}
