import { SurfaceColorToken } from '../tokens';
import { AspectRatio } from './blocks';
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
   * The background surface role.
   */
  background?: SurfaceColorToken;

  /**
   * The aspect ratio of the frame. Omitted, the frame sizes from
   * its width/height styles.
   */
  aspectRatio?: AspectRatio;
}
