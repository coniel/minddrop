import { BoardData, BoardDocument } from '../types';

/**
 * Returns the content of a board document.
 *
 * If the content is null, the content is parsed from
 * the file text content.
 *
 * @param board - The board document to get the content from.
 * @returns The content of the board document.
 */
export function getBoardContent(board: BoardDocument): BoardData {
  // If the board content is not null, return it
  if (board.content !== null) {
    return board.content;
  }

  return JSON.parse(board.fileTextContent).content;
}
