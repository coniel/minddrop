import { Block, DocumentViewProps } from '@minddrop/extension';
import { BoardListSection } from '../../types';
import './ListSection.css';

export interface ListSectionProps {
  /**
   * The list section.
   */
  section: BoardListSection;

  /**
   * Callback to update the section.
   */
  updateSection: (data: Partial<BoardListSection>) => void;

  /**
   * Callback to create blocks from a data transfer.
   */
  createBlocksFromDataTransfer: (
    dataTransfer: DataTransfer,
  ) => Promise<Block[]>;
}

export const ListSection: React.FC<ListSectionProps> = ({}) => {
  return <div>Not implemented</div>;
};
