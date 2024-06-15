import { BlockElementConfig } from '../../types';
import { parseParagraphElementFromMarkdown } from './parseParagraphElementFromMarkdown';
import { stringifyParagraphElementToMarkdown } from './stringifyParagraphElementToMarkdown';

export const ParagraphElementConfig: BlockElementConfig = {
  type: 'paragraph',
  fromMarkdown: parseParagraphElementFromMarkdown,
  toMarkdown: stringifyParagraphElementToMarkdown,
};
