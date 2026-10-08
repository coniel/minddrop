import { DesignElementConfig } from '@minddrop/designs-next';
import { ImageViewerElement } from './ImageViewerElement.types';
import { ImageViewerElementRenderer } from './ImageViewerElementRenderer';

export const ImageViewerElementType = 'image-viewer';

/**
 * Config for the image viewer element: the picture of the image
 * property it maps to, zoomed and panned inside its block. Not
 * listed on the grid palette: a viewer takes a page's height rather
 * than a block's.
 */
export const ImageViewerElementConfig: DesignElementConfig<ImageViewerElement> =
  {
    type: ImageViewerElementType,
    label: 'designsNext.elements.imageViewer.label',
    icon: 'scan-search',
    propertyTypes: ['image'],
    component: ImageViewerElementRenderer,
    defaultColumnSpan: 48,
    defaultRowSpan: 32,
  };
