import { DefaultImageViewerElementStyle } from '../styles';
import { ImageViewerElement } from '../types';

export type ImageViewerElementTemplate = Omit<ImageViewerElement, 'id'>;

export const ImageViewerElementTemplate: ImageViewerElementTemplate = {
  type: 'image-viewer',
  style: { ...DefaultImageViewerElementStyle },
};
