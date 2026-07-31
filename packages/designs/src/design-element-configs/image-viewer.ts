import {
  DefaultImageViewerElementStyle,
  ImageViewerElementStyle,
} from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ImageViewerElement extends DesignElementBase {
  type: 'image-viewer';

  /**
   * The element style.
   */
  style: ImageViewerElementStyle;

  /**
   * The file name of the element's own image stored in the
   * placeholder-media directory. Displayed when the element is
   * static.
   */
  content?: string;
}

export const ImageViewerElementConfig: DesignElementConfig = {
  type: 'image-viewer',
  icon: 'scan',
  label: 'design-studio.elements.image-viewer',
  group: 'media',
  styleCategory: 'image-viewer',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'image-viewer',
    style: { ...DefaultImageViewerElementStyle },
  },
};
