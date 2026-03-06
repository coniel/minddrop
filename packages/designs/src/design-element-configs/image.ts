import { DefaultImageElementStyle, ImageElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ImageElement extends DesignElementBase {
  type: 'image';

  /**
   * The element style.
   */
  style: ImageElementStyle;

  /**
   * The file name of a placeholder image stored in the
   * placeholder-media directory.
   */
  placeholderImage?: string;
}

export const ImageElementConfig: DesignElementConfig = {
  type: 'image',
  icon: 'image',
  label: 'design-studio.elements.image',
  group: 'media',
  styleCategory: 'image',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'image',
    style: { ...DefaultImageElementStyle },
  },
};
