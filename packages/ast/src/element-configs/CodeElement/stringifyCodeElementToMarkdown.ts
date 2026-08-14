import { getLiteralContent } from '../../utils';
import { CodeElement } from './CodeElement.types';

const DefaultFence = '`';
const DefaultFenceLength = 3;
const IndentedCodePrefix = '    ';

/**
 * Stringifies a code element into markdown.
 *
 * @param element - The code element to stringify.
 * @returns A markdown code block string.
 */
export const stringifyCodeElementToMarkdown = (
  element: CodeElement,
): string => {
  const content = getLiteralContent(element);

  // Indented code blocks carry no fence or info string, every line is
  // simply indented by four spaces
  if (element.indented) {
    return content
      .split('\n')
      .map((line) => `${IndentedCodePrefix}${line}`)
      .join('\n');
  }

  const fence = (element.fence || DefaultFence).repeat(
    element.fenceLength || DefaultFenceLength,
  );

  return `${fence}${resolveInfoString(element)}\n${content}\n${fence}`;
};

/**
 * Rebuilds the fence's info string from the element's language and meta.
 *
 * @param element - The code element.
 * @returns The info string, empty when the element has neither.
 */
function resolveInfoString(element: CodeElement): string {
  // A meta string is only meaningful alongside a language
  if (element.lang && element.meta) {
    return `${element.lang} ${element.meta}`;
  }

  return element.lang || '';
}
