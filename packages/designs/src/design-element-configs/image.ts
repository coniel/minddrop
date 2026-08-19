import { ImageStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ImageElement extends DesignElementBase {
  type: 'image';

  /**
   * The element style.
   */
  style: ImageStyle;

  /**
   * The file name of the element's own image stored in the media
   * directory of the entity owning the layout. Displayed when the
   * element is static.
   */
  content?: string;
}

export const ImageElementConfig: DesignElementConfig<ImageElement> = {
  type: 'image',
  icon: 'image',
  label: 'design-studio.elements.image',
  group: 'media',
  styleCategory: 'image',
  compatiblePropertyTypes: ['image'],
  supportsStaticContent: true,
  emptyBehavior: 'hide',
  template: {
    type: 'image',
    // New images start on photograph proportions with a covering
    // fit, the cover-image look most images are placed for
    style: {
      aspectRatio: '4/3',
      objectFit: 'cover',
    },
  },
};
