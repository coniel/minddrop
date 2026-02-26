import { ScrollArea } from '@minddrop/ui-primitives';
import { useElement } from '../../DesignStudioStore';
import { FlatRootDesignElement } from '../../types';
import { ElementsTreeNode } from './ElementsTreeNode';
import './ElementsTree.css';

export const ElementsTree: React.FC = () => {
  const root = useElement<FlatRootDesignElement>('root');

  if (!root) {
    return null;
  }

  return (
    <ScrollArea>
      <div className="elements-tree">
        <ElementsTreeNode elementId="root" depth={0} />
      </div>
    </ScrollArea>
  );
};
