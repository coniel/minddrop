import { ElementTypeConfig } from '../../types';
import { stringifyParagraphElementToMarkdown } from './stringifyParagraphElementToMarkdown';

export const ParagraphElementConfig: ElementTypeConfig = {
  type: 'paragraph',
  display: 'block',
  toMarkdown: stringifyParagraphElementToMarkdown,
};
