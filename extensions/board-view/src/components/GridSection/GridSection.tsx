import { DocumentViewProps } from '@minddrop/extension';
import { BoardGridSection } from '../../types';
import './GridSection.css';

export interface GridSectionProps
  extends Pick<DocumentViewProps, 'createBlocksFromDataInsert'> {
  /**
   * The grid section.
   */
  section: BoardGridSection;

  /**
   * Callback to update the section.
   */
  updateSection: (data: Partial<BoardGridSection>) => void;
}

export const GridSection: React.FC<GridSectionProps> = ({}) => {
  return <div>Not implemented</div>;
};
