import { RTBlockElementConfig } from '@minddrop/rich-text';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: RTBlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  component: HeadingOneElementComponent,
  shortcuts: ['# '],
};
