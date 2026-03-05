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
   * The file name of a placeholder image stored in the
   * placeholder-media directory.
   */
  placeholderImage?: string;
}

export const ImageViewerElementConfig: DesignElementConfig = {
  type: 'image-viewer',
  icon: 'scan',
  label: 'design-studio.elements.image-viewer',
  group: 'media',
  styleCategory: 'image-viewer',
  compatiblePropertyTypes: ['image', 'file'],
  template: {
    type: 'image-viewer',
    style: { ...DefaultImageViewerElementStyle },
  },
};
