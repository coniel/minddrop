import {
  IconSizeToken,
  RadiusToken,
  SpaceToken,
  SurfaceColorToken,
  TextColorToken,
} from '../tokens';
import { MarginStyle } from './blocks';

/**
 * Styles for the box optionally rendered around an icon.
 */
export interface IconContainerStyle {
  /**
   * The background surface role.
   */
  background?: SurfaceColorToken;

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
 * Styles for icon elements.
 */
export interface IconStyle extends MarginStyle {
  /**
   * The icon size step.
   */
  size?: IconSizeToken;

  /**
   * The icon color role.
   */
  color?: TextColorToken;

  /**
   * The box rendered around the icon. Omitted, the icon renders
   * bare.
   */
  container?: IconContainerStyle;
}
