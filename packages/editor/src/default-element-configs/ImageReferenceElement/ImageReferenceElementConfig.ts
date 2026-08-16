import { ImageReferenceElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { ImageReferenceElementComponent } from './ImageReferenceElementComponent';

export const ImageReferenceElementConfig: EditorBlockElementConfig<ImageReferenceElement> =
  {
    type: 'image-reference',
    component: ImageReferenceElementComponent,
  };
