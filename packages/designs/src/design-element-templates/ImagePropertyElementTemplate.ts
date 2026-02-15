import { ImagePropertyElement } from '../types';

export type ImagePropertyElementTemplate = Omit<ImagePropertyElement, 'id'>;

export const ImagePropertyElementTemplate: ImagePropertyElementTemplate = {
  type: 'image-property',
  property: '',
};
