import {
  BorderColorToken,
  BorderWidthToken,
  MeasureToken,
  RadiusToken,
  SizeToken,
  SpaceToken,
} from '../tokens';

export type BorderLineStyle = 'solid' | 'dashed' | 'dotted';

export type BorderEdge = 'top' | 'right' | 'bottom' | 'left';

/**
 * Border styles shared by every borderable element. Width and radius
 * are uniform; `borderEdges` limits which sides draw, covering the
 * accent-bar case (e.g. a thick left-only border).
 */
export interface BorderBlockStyle {
  /**
   * The border line style. Omitted, no border is drawn.
   */
  borderStyle?: BorderLineStyle;

  /**
   * The border color role. Omitted, defaults to `default`.
   */
  borderColor?: BorderColorToken;

  /**
   * The border width. Omitted, defaults to `thin`.
   */
  borderWidth?: BorderWidthToken;

  /**
   * The edges the border draws on. Omitted, all edges draw.
   */
  borderEdges?: BorderEdge[];

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
 * Token-expressible widths: `full` fills the parent, measures cap
 * at readable line lengths.
 */
export type WidthValue = 'auto' | 'full' | MeasureToken;

/**
 * Element width styles.
 */
export interface WidthStyle {
  /**
   * The element width.
   */
  width?: WidthValue;

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
 * Element height styles.
 */
export interface HeightStyle {
  /**
   * The element height.
   */
  height?: HeightValue;
}
