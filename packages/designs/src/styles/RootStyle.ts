import { SpaceToken } from '../tokens';
import { ContainerStyle } from './ContainerStyle';
import { BackgroundEmphasis } from './blocks';

export const RootBackgrounds = ['accent', 'transparent'] as const;

/**
 * The background treatments a layout root can take: `accent` takes
 * on the entry's colour, staying grey outside a colour scheme, and
 * `transparent` paints the surface views render on so the layout
 * blends into the view behind it.
 */
export type RootBackground = (typeof RootBackgrounds)[number];

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
   * and space layouts, `accent` otherwise.
   */
  background?: RootBackground;

  /**
   * The background emphasis level. Defaults to `subtle`. Ignored
   * by the transparent treatment, which has no strength to vary.
   */
  emphasis?: BackgroundEmphasis;

  /**
   * Horizontal padding around a page's content. Kept outside the
   * content width cap, so it only insets the content when the page
   * is too narrow to give the cap its full measure.
   */
  contentPadding?: SpaceToken;
}
