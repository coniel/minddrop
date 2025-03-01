import { ElementTypeConfig } from '../../types';
import { stringifyHeadingElementToMarkdown } from './stringifyHeadingElementToMarkdown';

export const HeadingElementConfig: ElementTypeConfig = {
  type: 'heading',
  display: 'block',
  toMarkdown: stringifyHeadingElementToMarkdown,
};
