import { RichTextBlockElementConfig } from '../../types';
import { HeadingThreeElementComponent } from './HeadingThreeElementComponent';

export const HeadingThreeElementConfig: RichTextBlockElementConfig = {
  type: 'heading-3',
  level: 'block',
  component: HeadingThreeElementComponent,
  shortcuts: ['### '],
};
