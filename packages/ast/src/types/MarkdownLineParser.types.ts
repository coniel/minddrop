import { Element } from './Element.types';

/**
 * Parses one or more lines of markdown text, returning a block level
 * element or `null` if the line is not a match for the parser's rules.
 *
 * @param line - The current line being parsed.
 * @param cosume - Consumes the current line or specified number of lines.
 * @param nextLine - Returns the next line. Subsequent calls return subsequent lines. Returns `null` if there is no next line (end of file).
 * @returns The parsed elements(s) or `null` if the line is not a match.
 */
export type MarkdownLineParser = (
  line: string,
  consume: (lineCount?: number) => void,
  nextLine: () => string | null,
) => Element | Element[] | null;
