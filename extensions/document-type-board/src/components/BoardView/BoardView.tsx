import { DocumentViewProps } from '@minddrop/documents';
import { BoardData } from '../../types';

export const BoardView: React.FC<DocumentViewProps<BoardData>> = ({
  document,
}) => {
  console.log(document);

  return <div className="board-view">Board</div>;
};
