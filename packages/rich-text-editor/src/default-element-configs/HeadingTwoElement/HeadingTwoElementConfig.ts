import { RichTextBlockElementConfig } from '../../types';
import { HeadingTwoElementComponent } from './HeadingTwoElementComponent';

export const HeadingTwoElementConfig: RichTextBlockElementConfig = {
  type: 'heading-2',
  level: 'block',
  component: HeadingTwoElementComponent,
  shortcuts: ['## '],
};
