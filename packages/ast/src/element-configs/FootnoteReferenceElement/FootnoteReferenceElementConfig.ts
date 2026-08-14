import { ElementTypeConfig } from '../../types';
import { stringifyFootnoteReferenceElementToMarkdown } from './stringifyFootnoteReferenceElementToMarkdown';

export const FootnoteReferenceElementConfig: ElementTypeConfig = {
  type: 'footnote-reference',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyFootnoteReferenceElementToMarkdown,
};
