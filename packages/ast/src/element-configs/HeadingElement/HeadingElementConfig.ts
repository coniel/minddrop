import { ElementTypeConfig } from '../../types';
import { stringifyHeadingElementToMarkdown } from './stringifyHeadingElementFromMarkdown';

export const HeadingElementConfig: ElementTypeConfig = {
  type: 'heading',
  display: 'block',
  toMarkdown: stringifyHeadingElementToMarkdown,
};
