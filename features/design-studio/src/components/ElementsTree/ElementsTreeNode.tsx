import { UiIconName } from '@minddrop/icons';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icon,
  Text,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, useElement } from '../../DesignStudioStore';
import { FlatDesignElement } from '../../types';

export interface ElementsTreeNodeProps {
  elementId: string;
  depth: number;
}

export const iconMap: Record<string, UiIconName> = {
  root: 'layout',
  container: 'box',
  text: 'align-left',
  'formatted-text': 'file-text',
  number: 'hash',
  url: 'link',
  image: 'image',
};

export const labelMap: Record<string, string> = {
  container: 'design-studio.elements.container',
  text: 'design-studio.elements.text',
  'formatted-text': 'design-studio.elements.formatted-text',
  number: 'design-studio.elements.number',
  url: 'design-studio.elements.url',
  image: 'design-studio.elements.image',
};

function hasChildren(
  element: FlatDesignElement,
): element is FlatDesignElement & { children: string[] } {
  return 'children' in element && Array.isArray(element.children);
}

export const ElementsTreeNode: React.FC<ElementsTreeNodeProps> = ({
  elementId,
  depth,
}) => {
  const element = useElement(elementId);
  const designType = DesignStudioStore((state) => state.design?.type);

  if (!element) {
    return null;
  }

  const icon = iconMap[element.type] || 'box';
  const label =
    element.type === 'root' && designType
      ? `designs.${designType}.name`
      : labelMap[element.type] || element.type;
  const isContainer = hasChildren(element) && element.children.length > 0;

  const handleClick = () => {
    DesignStudioStore.getState().selectElement(elementId);
  };

  if (isContainer) {
    return (
      <Collapsible defaultOpen>
        <div
          className="elements-tree-node"
          style={{ paddingLeft: `calc(var(--space-4) * ${depth})` }}
          onClick={handleClick}
        >
          <CollapsibleTrigger
            className="elements-tree-node-chevron-trigger"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon name="chevron-down" className="elements-tree-node-chevron" />
          </CollapsibleTrigger>
          <Icon name={icon} className="elements-tree-node-icon" />
          <Text size="sm" text={label} />
        </div>
        <CollapsibleContent>
          {element.children.map((childId) => (
            <ElementsTreeNode
              key={childId}
              elementId={childId}
              depth={depth + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <div
      className="elements-tree-node"
      style={{ paddingLeft: `calc(var(--space-4) * ${depth})` }}
      onClick={handleClick}
    >
      <span className="elements-tree-node-chevron-placeholder" />
      <Icon name={icon} className="elements-tree-node-icon" />
      <Text size="sm" text={label} />
    </div>
  );
};
