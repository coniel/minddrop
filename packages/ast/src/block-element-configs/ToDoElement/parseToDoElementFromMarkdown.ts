import { BlockElementParser } from '../../types';
import { generateBlockElement } from '../../utils';
import { ToDoElement } from './ToDoElement.types';

/**
 * Parses a to-do list item in the GitHub flavour markdown format,
 * including checked status and nesting level.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns The parsed to-do list item or `null` if the line is not a to-do list item.
 */
export const parseToDoElementFromMarkdown: BlockElementParser<ToDoElement> = (
  line,
  consume,
): ToDoElement | null => {
  // Matches GitHub-style to-do list items
  const toDoRegex = /^\s*-\s+\[[ x]\]\s/;
  // Matches checked to-do list items (i.e. `- [x]`)
  const checkedToDoRegex = /^\s*-\s+\[[x]\]\s/;
  // Matches leading whitespace
  const nestingRegex = /^\s*/;

  if (line.match(toDoRegex)) {
    // Remove the to-do list item marker from the line
    const text = line.replace(toDoRegex, '');
    // Check if the to-do list item is checked
    const done = checkedToDoRegex.test(line);
    // Determine the nesting level of the to-do list item.
    // This is the number of leading spaces at the beginning
    // of the line divided by 2 rounded down.
    const depth = Math.floor(nestingRegex.exec(line)![0].length / 4);

    // Consume the line
    consume();

    return generateBlockElement<ToDoElement>('to-do', {
      depth,
      checked: done,
      children: [{ text }],
    });
  }

  return null;
};
