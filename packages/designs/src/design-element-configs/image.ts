import { DefaultImageElementStyle, ImageElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ImageElement extends DesignElementBase {
  type: 'image';

  /**
   * The element style.
   */
  style: ImageElementStyle;

  /**
   * The file name of the element's own image stored in the
   * placeholder-media directory. Displayed when the element is
   * static.
   */
  content?: string;
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
