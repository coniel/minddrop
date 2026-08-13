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
  template: {
    type: 'image',
    style: {},
  },
};
