import { BlockElementConfig } from '../../types';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: BlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  component: HeadingOneElementComponent,
  shortcuts: ['# '],
};
