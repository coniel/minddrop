import { TextColorToken } from '../tokens';

/**
 * The presentation variants of a property element's name label:
 * a fine-print line above the value, a line beside it, or a
 * spread row pushing the value to the far side.
 */
export type PropertyLabelVariant = 'above' | 'side' | 'spread';

/**
 * The presentation variants of a property element's icon: a glyph
 * beside or above the value.
 */
export type PropertyIconVariant = 'side' | 'above';

/**
 * Styles for the property name label rendered alongside a property
 * element's value. The selected variant carries the label's fixed
 * look; only the colour is styled per element.
 */
export interface PropertyLabelStyle {
  /**
   * The label's presentation variant. Omitted, the label renders
   * above the value.
   */
  variant?: PropertyLabelVariant;

  /**
   * The label colour step. Omitted, the label renders subtle.
   */
  color?: TextColorToken;
}

/**
 * Styles for the property icon rendered alongside a property
 * element's value.
 */
export interface PropertyIconStyle {
  /**
   * The icon's presentation variant. Omitted, the icon renders
   * beside the value.
   */
  variant?: PropertyIconVariant;

  /**
   * The icon colour step. Omitted, the icon renders subtle.
   */
  color?: TextColorToken;
}

/**
 * The property name label and property icon optionally rendered
 * alongside a property element's value. Either object being
 * present is what enables its rendering, so themes never set
 * them.
 */
export interface PropertyChromeStyles {
  /**
   * The property name label. Omitted, no label renders.
   */
  label?: PropertyLabelStyle;

  /**
   * The property icon. Omitted, no icon renders.
   */
  icon?: PropertyIconStyle;
}
