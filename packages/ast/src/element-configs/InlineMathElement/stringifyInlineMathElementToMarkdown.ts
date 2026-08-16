import { getLiteralContent } from '../../utils';
import { InlineMathElement } from './InlineMathElement.types';

const MathDelimiter = '$';

/**
 * Stringifies an inline math element into markdown.
 *
 * @param element - The inline math element to stringify.
 * @returns A markdown inline math string.
 */
export const stringifyInlineMathElementToMarkdown = (
  element: InlineMathElement,
): string => {
  return `${MathDelimiter}${getLiteralContent(element)}${MathDelimiter}`;
};
