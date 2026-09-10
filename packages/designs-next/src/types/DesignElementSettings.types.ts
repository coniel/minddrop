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

export interface TextSettings {
  /**
   * The weight the text renders at. Absent means the weight the
   * element's type renders at by default.
   */
  fontWeight?: FontWeight;

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
