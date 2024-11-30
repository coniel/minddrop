import { Block } from '@minddrop/extension';
import { BoardGridSection } from '../../types';
import './GridSection.css';

export interface GridSectionProps {
  /**
   * The grid section.
   */
  section: BoardGridSection;

  /**
   * Callback to update the section.
   */
  updateSection: (data: Partial<BoardGridSection>) => void;

  /**
   * Callback to create blocks from a data transfer.
   */
  createBlocksFromDataTransfer: (
    dataTransfer: DataTransfer,
  ) => Promise<Block[]>;
}

export const GridSection: React.FC<GridSectionProps> = ({}) => {
  return <div>Not implemented</div>;
};
