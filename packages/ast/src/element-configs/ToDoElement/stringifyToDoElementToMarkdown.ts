import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { ToDoElement } from './ToDoElement.types';

/**
 * Stringifies to-do elements to markdown.
 *
 * @param element - The to-do element to stringify.
 * @returns A markdown to-do string.
 */
export const stringifyToDoElementToMarkdown = (
  element: ToDoElement,
): string => {
  // Each level of nesting is represented by 4 spaces
  const nestingPadding = ' '.repeat((element.depth || 0) * 4);
  // A done to-do element is represented by an 'x' in the brackets
  const doneIndicator = element.checked ? 'x' : ' ';
  // The to-do text content
  const content = stringifyFragmentToMarkdown(element.children);

  return `${nestingPadding}- [${doneIndicator}] ${content}`;
};
