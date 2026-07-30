import { ScrollArea } from '@minddrop/ui-primitives';
import { useDesignStudioStore } from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { layoutTypeIconMap } from '../constants';
import { ElementsTreeNode } from './ElementsTreeNode';
import './ElementsTree.css';

/**
 * Renders the layers tree of the design open in the studio: one
 * top-level node per layout containing its element tree.
 */
export const ElementsTree: React.FC = () => {
  const design = useDesignStudioStore((state) => state.design);

  if (!design) {
    return null;
  }

  return (
    <ScrollArea>
      <div className="elements-tree">
        {design.layouts.map((layout) => (
          <LayoutIdProvider key={layout.id} value={layout.id}>
            <ElementsTreeNode
              elementId="root"
              depth={0}
              label={layout.name}
              icon={layoutTypeIconMap[layout.type]}
            />
          </LayoutIdProvider>
        ))}
      </div>
    </ScrollArea>
  );
};
