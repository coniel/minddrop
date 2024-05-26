import { BlockElementConfig } from '../../types';
import { HeadingTwoElementComponent } from './HeadingTwoElementComponent';

export const HeadingTwoElementConfig: BlockElementConfig = {
  type: 'heading-2',
  level: 'block',
  component: HeadingTwoElementComponent,
  shortcuts: ['## '],
};
