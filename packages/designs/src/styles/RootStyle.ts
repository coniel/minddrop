import { SpaceToken } from '../tokens';
import { ContainerStyle } from './ContainerStyle';

export const RootBackgrounds = ['neutral', 'accent', 'transparent'] as const;

/**
 * The background treatments a layout root can take: `neutral` sits
 * on the pinned neutral surface a scheme cannot recolour, `accent`
 * takes on the colour scheme's accent surface, and `transparent`
 * paints the surface views render on so the layout blends into the
 * view behind it.
 */
export type RootBackground = (typeof RootBackgrounds)[number];

export const RootBackgroundEmphases = ['subtle', 'regular', 'solid'] as const;

/**
 * How strongly a neutral or accent background applies its
 * surface: a quiet wash, the standard strength, or a solid fill
 * paired with contrasting text.
 */
export type RootBackgroundEmphasis = (typeof RootBackgroundEmphases)[number];

/**
 * Styles for layout roots. The background is a semantic treatment
 * resolved to a surface role at CSS generation, rather than a
 * surface token pick. An unset background resolves per layout
 * type, so a root never renders see-through over the view behind
 * it.
 */
export interface RootStyle extends Omit<ContainerStyle, 'background'> {
  /**
   * The background treatment. Defaults to `transparent` on page
   * and space layouts, `neutral` otherwise.
   */
  background?: RootBackground;

  /**
   * The background emphasis level. Defaults to `subtle`. Ignored
   * by the transparent treatment, which has no strength to vary.
   */
  emphasis?: RootBackgroundEmphasis;

  /**
   * Horizontal padding around a page's content. Kept outside the
   * content width cap, so it only insets the content when the page
   * is too narrow to give the cap its full measure.
   */
  contentPadding?: SpaceToken;
}
