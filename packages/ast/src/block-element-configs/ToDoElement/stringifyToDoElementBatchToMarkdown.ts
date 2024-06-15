import { BatchBlockElementStringifier } from '../../types';
import { ToDoElement } from './ToDoElement.types';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';

/**
 * Stringifies consecutive markdown to-do elements into a
 * markdown to-do list string.
 *
 * @param element - The to-do elements to stringify.
 * @returns A markdown to-do list string.
 */
export const stringifyToDoElementBatchToMarkdown: BatchBlockElementStringifier<
  ToDoElement
> = (element): string => {
  return element
    .map((element) => stringifyToDoElementToMarkdown(element))
    .join('\n');
};
