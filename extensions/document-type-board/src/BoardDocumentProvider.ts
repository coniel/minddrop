import { Node } from '@minddrop/nodes';
import { createContext } from '@minddrop/utils';
import { BoardDocument } from './types';
import { getBoardContent } from './getBoardContent';

const [hook, Provider] = createContext<BoardDocument>();

export const useBoardDocument = hook;
export const BoardNodesProvider = Provider;

export const useNodes = () => {
  const board = useBoardDocument();

  const { nodes } = getBoardContent(board);

  return nodes;
};

export const useChildNodes = (childNodeIds: string[] = []) => {
  const nodes = useNodes();

  return childNodeIds
    .map((id) => nodes.find((node) => node.id === id))
    .filter(Boolean) as Node[];
};
