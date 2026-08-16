import { UnsupportedElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { UnsupportedElementComponent } from './UnsupportedElementComponent';

export const UnsupportedElementConfig: EditorBlockElementConfig<UnsupportedElement> =
  {
    type: 'unsupported',
    component: UnsupportedElementComponent,
  };
