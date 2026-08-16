import { ImageElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { ImageElementComponent } from './ImageElementComponent';

export const ImageElementConfig: EditorBlockElementConfig<ImageElement> = {
  type: 'image',
  component: ImageElementComponent,
};
