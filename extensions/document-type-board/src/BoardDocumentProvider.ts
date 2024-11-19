import { Node, Utils } from '@minddrop/extension';
import { BoardDocument } from './types';
import { getBoardContent } from './getBoardContent';

const [hook, Provider] = Utils.createContext<BoardDocument>();

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
