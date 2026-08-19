import { useTranslation } from '@minddrop/i18n';
import { TransientViewStateScope } from '@minddrop/ui-primitives';
import { useActiveLayout } from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { layoutTypeIconMap, layoutTypeNameMap } from '../constants';
import { ElementsTreeNode } from './ElementsTreeNode';
import './ElementsTree.css';

/**
 * Renders the element tree of the layout being edited, rooted at a
 * node named after the layout type. Renders nothing while no layout
 * is active.
 */
export const ElementsTree: React.FC = () => {
  const { t } = useTranslation();
  const layout = useActiveLayout();

  if (!layout) {
    return null;
  }

  return (
    <div className="designs-elements-tree">
      {/** Each layout's nodes expand and collapse independently **/}
      <TransientViewStateScope segment={layout.id}>
        <LayoutIdProvider value={layout.id}>
          <ElementsTreeNode
            elementId="root"
            depth={0}
            index={0}
            isLastChild
            label={t(layoutTypeNameMap[layout.type])}
            icon={layoutTypeIconMap[layout.type]}
          />
        </LayoutIdProvider>
      </TransientViewStateScope>
    </div>
  );
};
