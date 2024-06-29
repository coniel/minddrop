import { Node } from '@minddrop/nodes';

export interface BoardData {
  /**
   * All nodes in the board.
   */
  nodes: Node[];

  /**
   * IDs of the nodes that are at the root of the board,
   * in the order they should be displayed.
   */
  rootNodes: string[];
}
