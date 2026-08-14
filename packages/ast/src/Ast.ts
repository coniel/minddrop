import { MarkdownLineParsers } from './MarkdownLineParsers';
import { parseElementsFromMarkdown } from './parseElementsFromMarkdown';
import { Element } from './types';

export { generateElement } from './utils';
export { stringifyElementsToPlainText as toPlainText } from './stringifyElementsToPlainText';
export { stringifyFragmentToPlainText as fragmentToPlainText } from './stringifyFragmentToPlainText';
export { stringifyElementsToMarkdown as toMarkdown } from './stringifyElementsToMarkdown';
export { stringifyFragmentToMarkdown as fragmentToMarkdown } from './stringifyFragmentToMarkdown';

export function fromMarkdown(markdown: string): Element[] {
  return parseElementsFromMarkdown(MarkdownLineParsers, markdown);
}
