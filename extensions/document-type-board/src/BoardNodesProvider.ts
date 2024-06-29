import { Node } from '@minddrop/nodes';
import { createContext } from '@minddrop/utils';

const [hook, Provider] = createContext<Node[]>();

export const useBoardNodes = hook;
export const BoardNodesProvider = Provider;

export const useChildNodes = (childNodeIds: string[] = []) => {
  const nodes = useBoardNodes();

  return childNodeIds
    .map((id) => nodes.find((node) => node.id === id))
    .filter(Boolean) as Node[];
};
