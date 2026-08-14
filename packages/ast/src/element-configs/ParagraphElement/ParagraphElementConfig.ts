import { ElementTypeConfig } from '../../types';
import { stringifyParagraphElementToMarkdown } from './stringifyParagraphElementToMarkdown';

export const ParagraphElementConfig: ElementTypeConfig = {
  type: 'paragraph',
  level: 'block',
  content: 'inline',
  toMarkdown: stringifyParagraphElementToMarkdown,
};
