import { DefaultImageElementStyle } from '../styles';
import { ImageElement } from '../types';

export type ImageElementTemplate = Omit<ImageElement, 'id'>;

export const ImageElementTemplate: ImageElementTemplate = {
  type: 'image',
  style: { ...DefaultImageElementStyle },
};
