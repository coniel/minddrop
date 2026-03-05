import { useTranslation } from '@minddrop/i18n';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icon,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, useElement } from '../DesignStudioStore';
import { elementIconMap, elementLabelMap } from '../constants';
import { FlatDesignElement } from '../types';

export interface ElementsTreeNodeProps {
  elementId: string;
  depth: number;
}

function hasChildren(
  element: FlatDesignElement,
): element is FlatDesignElement & { children: string[] } {
  return 'children' in element && Array.isArray(element.children);
}

export const ElementsTreeNode: React.FC<ElementsTreeNodeProps> = ({
  elementId,
  depth,
}) => {
  const { t } = useTranslation();
  const element = useElement(elementId);
  const designType = DesignStudioStore((state) => state.design?.type);
  const selectedElementId = DesignStudioStore(
    (state) => state.selectedElementId,
  );

  if (!element) {
    return null;
  }

  const icon = elementIconMap[element.type] || 'box';
  const labelKey =
    element.type === 'root' && designType
      ? (`designs.${designType}.name` as const)
      : elementLabelMap[element.type];
  const isContainer = hasChildren(element) && element.children.length > 0;
  const isSelected = selectedElementId === elementId;

  // Indentation: 4px per depth level, plus base padding
  const indent = `calc(var(--space-2) + var(--space-1) * ${depth})`;

  const handleClick = () => {
    DesignStudioStore.getState().selectElement(elementId);
  };

  if (isContainer) {
    return (
      <Collapsible defaultOpen>
        <div
          className="elements-tree-node"
          data-selected={isSelected}
          style={{ paddingLeft: indent }}
          onClick={handleClick}
        >
          <CollapsibleTrigger
            className="elements-tree-node-chevron-trigger"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon name="chevron-down" className="elements-tree-node-chevron" />
          </CollapsibleTrigger>
          <Icon name={icon} className="elements-tree-node-icon" />
          <span className="elements-tree-node-label">
            {labelKey ? t(labelKey) : element.type}
          </span>
        </div>
        <CollapsibleContent>
          <div
            className="elements-tree-indent-guide"
            style={{
              marginLeft: `calc(var(--space-2) + var(--space-1) * ${depth} + 0.375rem - 0.5px)`,
            }}
          >
            {element.children.map((childId) => (
              <ElementsTreeNode
                key={childId}
                elementId={childId}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div
      className="elements-tree-node"
      data-selected={isSelected}
      style={{ paddingLeft: indent }}
      onClick={handleClick}
    >
      <span className="elements-tree-node-chevron-placeholder" />
      <Icon name={icon} className="elements-tree-node-icon" />
      <span className="elements-tree-node-label">
        {labelKey ? t(labelKey) : element.type}
      </span>
    </div>
  );
};
