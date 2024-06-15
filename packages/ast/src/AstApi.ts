import { BlockElementConfigsStore } from './BlockElementConfigsStore';
import { parseBlockElementsFromMarkdown } from './parseBlockElementsFromMarkdown';
import { BlockElement } from './types';

export { registerDefaultElementConfigs as registerDefaultConfigs } from './utils/registerDefaultElementConfigs';
export {
  generateBlockElement,
  generateInlineElement,
  isElement,
  isBlockElement as isBlock,
  isContainerBlockElement as isContainerBlock,
  isVoidBlockElement as isVoidBlock,
  isInlineElement as isInline,
  isVoidInlineElement as isVoidInline,
  isVoidElement as isVoid,
} from './utils';
export { stringifyBlockElementsToPlainText as toPlainText } from './stringifyBlockElementsToPlainText';
export { stringifyFragmentToPlainText as fragmentToPlainText } from './stringifyFragmentToPlainText';
export { stringifyBlockElementsToMarkdown as toMarkdown } from './stringifyBlockElementsToMarkdown';
export { stringifyFragmentToMarkdown as fragmentToMarkdown } from './stringifyFragmentToMarkdown';

export function fromMarkdown(markdown: string): BlockElement[] {
  // Get the markdown parsers for all registered block element configs
  const parsers = Object.values(BlockElementConfigsStore.getAll()).map(
    (config) => config.fromMarkdown,
  );

  return parseBlockElementsFromMarkdown(parsers, markdown);
}
