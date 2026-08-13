import { SurfaceColorToken } from '../tokens';
import { AspectRatio } from './ImageStyle';
import {
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  WidthStyle,
} from './blocks';

/**
 * Styles for embedded frame elements: views, webviews and image
 * viewers.
 */
export interface EmbedStyle
  extends MarginStyle,
    BorderBlockStyle,
    WidthStyle,
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
