import { EmbedStyle, ImageStyle } from '../../styles';
import { PropertyElementBase } from './base';

/**
 * A property element rendering an image property. The style shape
 * follows the selected variant: a placed picture takes the image
 * style, the viewer the frame style.
 */
export interface ImagePropertyElement extends PropertyElementBase {
  propertyType: 'image';

  /**
   * The element style.
   */
  style: ImageStyle | EmbedStyle;
}
