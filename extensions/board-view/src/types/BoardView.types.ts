import { DocumentView } from '@minddrop/extension';
import { BoardSection } from './BoardSection.types';

export interface BoardView extends DocumentView {
  type: 'board';

  /**
   * Sections in the board.
   */
  sections: BoardSection[];
}
