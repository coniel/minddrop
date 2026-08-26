import { AspectRatio, BackgroundEmphasis } from './blocks';
import {
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  MaxWidthStyle,
} from './blocks';

/**
 * Styles for embedded frame elements: views, webviews and image
 * viewers.
 */
export interface EmbedStyle
  extends MarginStyle,
    BorderBlockStyle,
    MaxWidthStyle,
    HeightStyle {
  /**
   * How strongly the frame's fill applies the surface. Omitted, the
   * frame renders unfilled.
   */
  background?: BackgroundEmphasis;

  /**
   * The aspect ratio of the frame. Omitted, the frame sizes from
   * its width/height styles.
   */
  aspectRatio?: AspectRatio;
}
