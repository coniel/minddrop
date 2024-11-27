import { Block } from '@minddrop/extension';

export interface BoardContent {
  /**
   * All blocks in the board.
   */
  blocks: Block[];

  /**
   * IDs of the blocks that are at the root of the board,
   * in the order they should be displayed.
   */
  rootBlocks: string[];
}
