import {
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  WidthStyle,
} from './blocks';

/**
 * Fixed aspect presets emitting constant CSS ratios. Enumerated
 * vocabulary like text alignment, not theme tokens.
 */
export type AspectRatio = 'square' | 'landscape' | 'portrait' | 'wide';

export type ObjectFit = 'cover' | 'contain' | 'fill';

/**
 * Styles for image elements.
 */
export interface ImageStyle
  extends MarginStyle,
    BorderBlockStyle,
    WidthStyle,
    HeightStyle {
  /**
   * The aspect ratio the image is cropped to. Omitted, the image
   * keeps its natural proportions.
   */
  aspectRatio?: AspectRatio;

  /**
   * How the image fits its box.
   */
  objectFit?: ObjectFit;
}
