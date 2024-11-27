import { useCallback } from 'react';
import { BlockRendererProps, Block, useApi } from '@minddrop/extension';
import { BoardColumnBlock } from '../BoardColumnBlock';
import { BoardColumnsBlock } from '../BoardColumnsBlock';
import { useBoardDocument } from '../../BoardDocumentProvider';
import { updateBlockInBoard } from '../../updateBlockInBoard';
import { getBoardContent } from '../../getBoardContent';
import { removeBlockFromBoard } from '../../removeBlockFromBoard';

export const BoardBlock: React.FC<Pick<BlockRendererProps, 'block'>> = ({
  block,
  ...other
}) => {
  const {
    Blocks: { BlockRenderer },
  } = useApi();
  const API = useApi();
  const board = useBoardDocument();

  const onChange = useCallback(
    (block: Block) => {
      const content = updateBlockInBoard(getBoardContent(board), block);

      API.Documents.update(board.path, { content });
    },
    [board, API],
  );

  const onDelete = useCallback(
    (block: Block) => {
      removeBlockFromBoard(
        API,
        { ...board, content: getBoardContent(board) },
        block,
      );
    },
    [board, API],
  );

  switch (block.type) {
    case 'board-columns':
      return <BoardColumnsBlock block={block} {...other} />;
    case 'board-column':
      return <BoardColumnBlock block={block} {...other} />;
    default:
      return (
        <BlockRenderer
          block={block}
          onChange={onChange}
          onDelete={onDelete}
          {...other}
        />
      );
  }
};
