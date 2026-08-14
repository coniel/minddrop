import { ElementTypeConfig } from '../../types';
import { stringifyInlineHtmlElementToMarkdown } from './stringifyInlineHtmlElementToMarkdown';

export const InlineHtmlElementConfig: ElementTypeConfig = {
  type: 'inline-html',
  level: 'inline',
  content: 'void',
  toMarkdown: stringifyInlineHtmlElementToMarkdown,
  // Raw markup is not text content
  toPlainText: () => '',
};
