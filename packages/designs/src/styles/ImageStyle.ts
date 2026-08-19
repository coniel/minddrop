import {
  AspectRatio,
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  ObjectFit,
} from './blocks';

/**
 * Styles for image elements. Images have no width of their own:
 * they span their container, sized by their height or proportions.
 */
export interface ImageStyle extends MarginStyle, BorderBlockStyle, HeightStyle {
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
