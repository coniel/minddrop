import { BlockElementConfig } from '../../types';
import { HeadingThreeElementComponent } from './HeadingThreeElementComponent';

export const HeadingThreeElementConfig: BlockElementConfig = {
  type: 'heading-3',
  level: 'block',
  component: HeadingThreeElementComponent,
  shortcuts: ['### '],
};
