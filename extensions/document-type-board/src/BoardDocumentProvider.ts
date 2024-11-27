import { Block, Utils } from '@minddrop/extension';
import { BoardDocument } from './types';
import { getBoardContent } from './getBoardContent';

const [hook, Provider] = Utils.createContext<BoardDocument>();

export const useBoardDocument = hook;
export const BoardBlocksProvider = Provider;

export const useBlocks = () => {
  const board = useBoardDocument();

  const { blocks } = getBoardContent(board);

  return blocks;
};

export const useChildBlocks = (childBlockIds: string[] = []) => {
  const blocks = useBlocks();

  return childBlockIds
    .map((id) => blocks.find((block) => block.id === id))
    .filter(Boolean) as Block[];
};
