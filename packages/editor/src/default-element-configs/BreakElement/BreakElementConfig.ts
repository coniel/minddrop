import { BreakElement } from '@minddrop/ast';
import { EditorBlockElementConfig } from '../../types';
import { BreakElementComponent } from './BreakElementComponent';

export const BreakElementConfig: EditorBlockElementConfig<BreakElement> = {
  type: 'break',
  component: BreakElementComponent,
};
