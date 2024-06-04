import { BlockElementParser } from '../../types';
import { ToDoElement } from '@minddrop/editor';

/**
 * Parses a to-do list item in the GitHub flavour markdown format,
 * including checked status and nesting level.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns The parsed to-do list item or `null` if the line is not a to-do list item.
 */
export const parseToDoElement: BlockElementParser = (
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
    const nestingLevel = Math.floor(nestingRegex.exec(line)![0].length / 2);

    // Consume the line
    consume();

    return {
      type: 'to-do',
      level: 'block',
      children: [{ text }],
      nestingLevel,
      done,
    };
  }

  return null;
};
