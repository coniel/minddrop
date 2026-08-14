import { getLiteralContent } from '../../utils';
import { MathElement } from './MathElement.types';

const MathFence = '$$';

/**
 * Stringifies a math element into markdown.
 *
 * @param element - The math element to stringify.
 * @returns A markdown math block string.
 */
export const stringifyMathElementToMarkdown = (
  element: MathElement,
): string => {
  return `${MathFence}${element.meta || ''}\n${getLiteralContent(
    element,
  )}\n${MathFence}`;
};
