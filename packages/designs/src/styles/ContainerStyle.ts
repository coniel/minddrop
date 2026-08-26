import { SizeToken, SpaceToken } from '../tokens';
import { AspectRatio, BackgroundEmphasis, ObjectFit } from './blocks';
import {
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  MaxWidthStyle,
  PaddingStyle,
} from './blocks';

export type ContainerDirection = 'row' | 'column';

export type ContainerAlign = 'start' | 'center' | 'end' | 'stretch';

export type ContainerJustify = 'start' | 'center' | 'end' | 'space-between';

export const BackdropBlurs = ['subtle', 'regular', 'strong'] as const;

/**
 * The preset strengths of the frost blurring what is behind a
 * container's surface, from a light haze to a heavy frost.
 */
export type BackdropBlur = (typeof BackdropBlurs)[number];

export const BackdropTints = ['accent'] as const;

/**
 * The colour washes a backdrop blur can be tinted with. Colour
 * always follows the entry's, so the accent surface is the only
 * wash on offer; an unset tint leaves the blur uncoloured.
 */
export type BackdropTint = (typeof BackdropTints)[number];

export const BackdropTintStrengths = ['subtle', 'regular', 'strong'] as const;

/**
 * How strongly the tint colours the blur, from a faint cast to a
 * heavy wash.
 */
export type BackdropTintStrength = (typeof BackdropTintStrengths)[number];

/**
 * The directions the backdrop fade runs in, from fully applied to
 * fully faded out.
 */
export type BackdropFadeDirection =
  | 'to-top'
  | 'to-bottom'
  | 'to-left'
  | 'to-right';

/**
 * Styles for layout containers, including the layout root. Text
 * styling and corner rounding are governed by the rendering
 * context's scheme, so containers offer neither.
 */
export interface ContainerStyle
  extends PaddingStyle,
    MarginStyle,
    Omit<BorderBlockStyle, 'borderRadius'>,
    MaxWidthStyle,
    HeightStyle {
  /**
   * The flex direction children lay out in. Omitted, children stack
   * in a column.
   */
  direction?: ContainerDirection;

  /**
   * The cross-axis alignment of children.
   */
  align?: ContainerAlign;

  /**
   * The main-axis distribution of children.
   */
  justify?: ContainerJustify;

  /**
   * Whether children wrap onto new lines.
   */
  wrap?: boolean;

  /**
   * The gap between children.
   */
  gap?: SpaceToken;

  /**
   * How strongly the background applies the surface. Omitted, the
   * container renders no background of its own.
   */
  background?: BackgroundEmphasis;

  /**
   * The height the container never shrinks below.
   */
  minHeight?: SizeToken;

  /**
   * The height the container never grows past, clipping whatever
   * content does not fit.
   */
  maxHeight?: SizeToken;

  /**
   * The proportions the container takes its height from, against
   * the width it is given.
   */
  aspectRatio?: AspectRatio;

  /**
   * The background image media file name.
   */
  backgroundImage?: string;

  /**
   * How the background image fits the container.
   */
  backgroundImageFit?: ObjectFit;

  /**
   * The strength of the frost blurring the background image and
   * whatever else sits behind the container's surface.
   */
  backdropBlur?: BackdropBlur;

  /**
   * The colour wash tinting the blur. Omitted, the blur is left
   * uncoloured.
   */
  backdropTint?: BackdropTint;

  /**
   * How strongly the tint colours the blur. Defaults to `regular`.
   */
  backdropTintStrength?: BackdropTintStrength;

  /**
   * The backdrop brightness as a percentage, for darkening or
   * lightening what is behind the surface so content stays
   * readable over it. Omitted, the brightness is left as it is.
   */
  backdropBrightness?: number;

  /**
   * Whether the backdrop effects fade out across the container
   * instead of covering it evenly.
   */
  backdropFade?: boolean;

  /**
   * The direction the fade runs in, from fully applied to fully
   * faded out. Defaults to `to-top`.
   */
  backdropFadeDirection?: BackdropFadeDirection;

  /**
   * How far across the container the effects stay at full strength
   * before the fade begins, as a percentage. Defaults to 0.
   */
  backdropFadeStart?: number;

  /**
   * How far across the container the fade reaches before the
   * effects are fully faded out, as a percentage. Defaults to 50.
   */
  backdropFadeExtent?: number;
}

/**
 * The style containers and layout roots are created with: children
 * stacked down the container, filling its width and spaced apart
 * rather than running flush together.
 */
export const DefaultContainerStyle = {
  direction: 'column',
  align: 'stretch',
  gap: '2',
} satisfies ContainerStyle;
