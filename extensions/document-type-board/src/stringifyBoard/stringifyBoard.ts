import { getBoardContent } from '../getBoardContent';
import { BoardDocument } from '../types';

/**
 * Stringifies a board document.
 * If the content is null, the content is parsed from the file text content.
 *
 * @param board - The board document to stringify.
 * @returns The stringified board document.
 */
export function stringifyBoard(board: BoardDocument): string {
  return JSON.stringify({
    properties: board.properties,
    content: getBoardContent(board),
  });
}
