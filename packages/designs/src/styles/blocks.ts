import {
  BorderWidthToken,
  MeasureToken,
  RadiusToken,
  SizeToken,
  SpaceToken,
} from '../tokens';

export type BorderLineStyle = 'solid' | 'dashed' | 'dotted';

export const BackgroundEmphases = ['subtle', 'regular', 'solid'] as const;

/**
 * How strongly a background applies its surface: a quiet wash, the
 * standard strength, or a solid fill flipping the text inside it to
 * the contrasting role. An unset background is what "no background"
 * means, so the scale carries no none step.
 */
export type BackgroundEmphasis = (typeof BackgroundEmphases)[number];

export const BorderEmphases = ['subtle', 'regular', 'strong'] as const;

/**
 * How strongly the border colour applies, from a hairline wash to
 * an emphasised outline. The colour itself always follows the
 * entry's, so emphasis is the only choice a border makes.
 */
export type BorderEmphasis = (typeof BorderEmphases)[number];

/**
 * Border styles shared by every borderable element. A border draws
 * once `borderStyle` is set: uniformly thin without per-side
 * widths, or only on the sides a width is set for, covering the
 * accent-bar case (e.g. a thick left-only border).
 */
export interface BorderBlockStyle {
  /**
   * The border line style. Omitted, no border is drawn.
   */
  borderStyle?: BorderLineStyle;

  /**
   * How strongly the border colour applies. Omitted, defaults to
   * `regular`.
   */
  borderEmphasis?: BorderEmphasis;

  /**
   * The top border width.
   */
  borderTopWidth?: BorderWidthToken;

  /**
   * The right border width.
   */
  borderRightWidth?: BorderWidthToken;

  /**
   * The bottom border width.
   */
  borderBottomWidth?: BorderWidthToken;

  /**
   * The left border width.
   */
  borderLeftWidth?: BorderWidthToken;

  /**
   * The corner radius.
   */
  borderRadius?: RadiusToken;
}

/**
 * Per-side outer margins.
 */
export interface MarginStyle {
  /**
   * The top margin.
   */
  marginTop?: SpaceToken;

  /**
   * The right margin.
   */
  marginRight?: SpaceToken;

  /**
   * The bottom margin.
   */
  marginBottom?: SpaceToken;

  /**
   * The left margin.
   */
  marginLeft?: SpaceToken;
}

/**
 * Per-side inner padding.
 */
export interface PaddingStyle {
  /**
   * The top padding.
   */
  paddingTop?: SpaceToken;

  /**
   * The right padding.
   */
  paddingRight?: SpaceToken;

  /**
   * The bottom padding.
   */
  paddingBottom?: SpaceToken;

  /**
   * The left padding.
   */
  paddingLeft?: SpaceToken;
}

/**
 * Element width styles. Elements are fluid, spanning the width
 * they are given; a measure can only cap it at a readable length.
 */
export interface MaxWidthStyle {
  /**
   * The maximum element width.
   */
  maxWidth?: MeasureToken;
}

/**
 * Token-expressible heights: `fill` grows into the remaining space
 * of the parent (e.g. a full-page embed below a header), size steps
 * fix the box height.
 */
export type HeightValue = 'fill' | SizeToken;

/**
 * The share of the space a filling element takes, against the
 * other filling elements beside it.
 */
export type FillRatio = 1 | 2 | 3 | 4;

/**
 * Element height styles.
 */
export interface HeightStyle {
  /**
   * The element height.
   */
  height?: HeightValue;

  /**
   * The share of the space the element takes while filling.
   * Omitted, it takes an equal share.
   */
  fillRatio?: FillRatio;
}

/**
 * The proportions a box can be held to, taller than wide first.
 * An enumerated vocabulary like text alignment, not theme tokens.
 */
export const AspectRatios = [
  '9/16',
  '2/3',
  '3/4',
  '4/5',
  '1/1',
  '5/4',
  '4/3',
  '3/2',
  '16/9',
] as const;

export type AspectRatio = (typeof AspectRatios)[number];

/**
 * The proportions taller than wide, from the squarest to the
 * tallest.
 */
export const PortraitAspectRatios: readonly AspectRatio[] = [
  '4/5',
  '3/4',
  '2/3',
  '9/16',
];

/**
 * The proportions wider than tall, from the squarest to the
 * widest.
 */
export const LandscapeAspectRatios: readonly AspectRatio[] = [
  '5/4',
  '4/3',
  '3/2',
  '16/9',
];

export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';

/**
 * How a box fits its imagery inside itself, shared by images and
 * container background images.
 */
export type ObjectFit = 'cover' | 'contain' | 'fill';
