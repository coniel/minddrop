import { RichTextBlockElementConfig } from '@minddrop/rich-text';
import { HeadingOneElementComponent } from './HeadingOneElementComponent';

export const HeadingOneElementConfig: RichTextBlockElementConfig = {
  type: 'heading-1',
  level: 'block',
  allowConversion: true,
  component: HeadingOneElementComponent,
  shortcuts: ['# '],
};
