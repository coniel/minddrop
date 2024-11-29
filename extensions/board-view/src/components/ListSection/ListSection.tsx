import { DocumentViewProps } from '@minddrop/extension';
import { BoardListSection } from '../../types';
import './ListSection.css';

export interface ListSectionProps
  extends Pick<DocumentViewProps, 'createBlocksFromDataInsert'> {
  /**
   * The list section.
   */
  section: BoardListSection;

  /**
   * Callback to update the section.
   */
  updateSection: (data: Partial<BoardListSection>) => void;
}

export const ListSection: React.FC<ListSectionProps> = ({}) => {
  return <div>Not implemented</div>;
};
