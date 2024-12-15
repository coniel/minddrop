import { ToDoElement } from './ToDoElement.types';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';

/**
 * Stringifies consecutive markdown to-do elements into a
 * markdown to-do list string.
 *
 * @param element - The to-do elements to stringify.
 * @returns A markdown to-do list string.
 */
export const stringifyToDoElementBatchToMarkdown = (
  elements: ToDoElement[],
): string => {
  return elements
    .map((element) => stringifyToDoElementToMarkdown(element))
    .join('\n');
};
