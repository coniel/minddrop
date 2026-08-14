import { ElementTypeConfig } from '../../types';
import { stringifyHtmlElementToMarkdown } from './stringifyHtmlElementToMarkdown';

export const HtmlElementConfig: ElementTypeConfig = {
  type: 'html',
  level: 'block',
  content: 'void',
  toMarkdown: stringifyHtmlElementToMarkdown,
  // Raw markup is not text content
  toPlainText: () => '',
};
