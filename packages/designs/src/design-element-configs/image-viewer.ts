import { EmbedStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ImageViewerElement extends DesignElementBase {
  type: 'image-viewer';

  /**
   * The element style.
   */
  style: EmbedStyle;

  /**
   * The file name of the element's own image stored in the media
   * directory of the entity owning the layout. Displayed when the
   * element is static.
   */
  content?: string;
}

export const ImageViewerElementConfig: DesignElementConfig<ImageViewerElement> =
  {
    type: 'image-viewer',
    icon: 'scan',
    label: 'design-studio.elements.image-viewer',
    group: 'media',
    styleCategory: 'embed',
    compatiblePropertyTypes: ['image'],
    template: {
      type: 'image-viewer',
      style: { height: 'fill' },
    },
  };
