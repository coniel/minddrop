import { MarkdownLineParsersStore } from './MarkdownLineParsersStore';
import { parseElementsFromMarkdown } from './parseElementsFromMarkdown';
import { Element } from './types';

export { registerDefaultElementConfigs as registerDefaultConfigs } from './utils/registerDefaultElementConfigs';
export { generateElement } from './utils';
export { stringifyElementsToPlainText as toPlainText } from './stringifyElementsToPlainText';
export { stringifyFragmentToPlainText as fragmentToPlainText } from './stringifyFragmentToPlainText';
export { stringifyElementsToMarkdown as toMarkdown } from './stringifyElementsToMarkdown';
export { stringifyFragmentToMarkdown as fragmentToMarkdown } from './stringifyFragmentToMarkdown';

export function fromMarkdown(markdown: string): Element[] {
  // Get the markdown parsers for all registered element type configs
  const parsers = MarkdownLineParsersStore.getAll();

  return parseElementsFromMarkdown(parsers, markdown);
}
