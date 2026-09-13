import { ColorLevel, ContentColor } from '@minddrop/ui-theme';

/**
 * A semantic setting group an element's menu can show. Groups are
 * provided by the system; an element's config lists the ones its
 * menu renders. Element-specific settings live on the element type
 * itself, configured through its own settings controls.
 */
export type DesignElementSettingGroup = 'text' | 'background';

export type ElementBackground = 'subtle' | 'accent' | 'solid-accent';

export type ElementCornerRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * A weight on the type scale, from the lightest to the heaviest.
 * Fonts without a matching face are drawn at the nearest one they
 * have.
 */
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * The edge text lines up on, its centre, or both edges at once.
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * The edge of its block text sits against, or its middle.
 */
export type VerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * A colour an element is drawn in. A content colour, and the step
 * of its ramp. The default colour follows the scheme the design
 * renders in.
 */
export interface ElementColor {
  /**
   * The colour's hue.
   */
  color: ContentColor;

  /**
   * The step of the hue's ramp.
   */
  level: ColorLevel;
}

export interface TextSettings {
  /**
   * The size the text is set at, in pixels. Absent means the size
   * the element's type renders at by default.
   */
  fontSize?: number;

  /**
   * The weight the text renders at. Absent means the weight the
   * element's type renders at by default.
   */
  fontWeight?: FontWeight;

  /**
   * The edge the text lines up on. Absent means the left edge.
   */
  textAlign?: TextAlign;

  /**
   * The edge of its block the text sits against. Absent means the
   * top edge.
   */
  verticalAlign?: VerticalAlign;

  /**
   * The colour the text is drawn in. Absent means the colour the
   * element's type draws it in.
   */
  textColor?: ElementColor;

  /**
   * Whether the text renders italic.
   */
  italic?: boolean;
}

export interface BackgroundSettings {
  /**
   * The element's background surface, mapped to the theme's semantic
   * surface tokens. Absent means the element's default surface.
   */
  background?: ElementBackground;

  /**
   * The element's corner radius, mapped to the theme's radius
   * tokens. Absent means the element's default radius.
   */
  cornerRadius?: ElementCornerRadius;
}

/**
 * The combined settings written by the system's setting groups.
 * Elements opt into individual groups via their config and extend
 * the matching settings interfaces on their element type.
 */
export interface DesignElementSettings
  extends TextSettings,
    BackgroundSettings {}
