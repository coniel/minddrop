import { useMemo } from 'react';
import { useApi, Block, DocumentViewProps } from '@minddrop/extension';
import { BoardContent } from '../../types';
import { BoardBlocksProvider } from '../../BoardDocumentProvider';
import { BoardBlock } from '../BoardBlock';
import './BoardView.css';

export const BoardView: React.FC<DocumentViewProps<BoardContent>> = ({
  document,
}) => {
  const { Selection } = useApi();
  console.log(document);
  const content = useMemo(
    () =>
      document.content
        ? document.content
        : (JSON.parse(document.fileTextContent).content as BoardContent),
    [document.content, document.fileTextContent],
  );

  const rootBlocks = useMemo(() => {
    return content.rootBlocks
      .map((id) => content.blocks.find((block) => block.id === id))
      .filter(isBlock);
  }, [content]);

  return (
    <BoardBlocksProvider value={document}>
      <div className="board-view" onClick={Selection.clear}>
        {rootBlocks.map((block) => (
          <BoardBlock key={block.id} block={block} />
        ))}
      </div>
    </BoardBlocksProvider>
  );
};

function isBlock(block: Block | undefined): block is Block {
  return block !== undefined;
}
