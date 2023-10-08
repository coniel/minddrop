import { RichTextBlockElementConfig } from '../../types';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: RichTextBlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  component: HeadingOneElementComponent,
  shortcuts: ['# '],
};
