import { useTranslation } from '@minddrop/i18n';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icon,
  Tooltip,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, useElement } from '../DesignStudioStore';
import { MappableIndicator } from '../MappableIndicator';
import {
  elementCompatiblePropertyTypesMap,
  elementIconMap,
  elementLabelMap,
  propertyTypeLabelMap,
} from '../constants';
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

  // Show mappable indicator for non-static elements with compatible types.
  // Containers/root are only mappable when they have a background image.
  const compatibleTypes = elementCompatiblePropertyTypesMap[element.type] || [];
  const isContainerOrRoot =
    element.type === 'container' || element.type === 'root';
  const hasBackgroundImage =
    isContainerOrRoot && 'style' in element
      ? !!(element.style as { backgroundImage?: string }).backgroundImage
      : false;
  const showMappable =
    !element.static &&
    compatibleTypes.length > 0 &&
    (!isContainerOrRoot || hasBackgroundImage);

  // Indentation: 4px per depth level, plus base padding
  const indent = `calc(var(--space-2) + var(--space-1) * ${depth})`;

  const handleClick = () => {
    DesignStudioStore.getState().selectElement(elementId);
  };

  // Build the tooltip description listing compatible property types
  const typeLabels = showMappable
    ? compatibleTypes
        .map((propertyType) => t(propertyTypeLabelMap[propertyType]))
        .join(', ')
    : '';

  if (isContainer) {
    return (
      <Collapsible defaultOpen>
        <MappableTooltipWrapper
          showMappable={showMappable}
          title={t('design-studio.mappable.tooltip')}
          description={typeLabels}
        >
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
              <Icon
                name="chevron-down"
                className="elements-tree-node-chevron"
              />
            </CollapsibleTrigger>
            <Icon name={icon} className="elements-tree-node-icon" />
            <span className="elements-tree-node-label">
              {labelKey ? t(labelKey) : element.type}
            </span>
            {showMappable && <MappableIndicator />}
          </div>
        </MappableTooltipWrapper>
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
    <MappableTooltipWrapper
      showMappable={showMappable}
      title={t('design-studio.mappable.tooltip')}
      description={typeLabels}
    >
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
        {showMappable && <MappableIndicator />}
      </div>
    </MappableTooltipWrapper>
  );
};

/**
 * Conditionally wraps children in a mappable tooltip.
 * Renders children directly when not mappable.
 */
const MappableTooltipWrapper: React.FC<{
  showMappable: boolean;
  title: string;
  description: string;
  children: React.ReactElement;
}> = ({ showMappable, title, description, children }) => {
  if (!showMappable) {
    return children;
  }

  return (
    <Tooltip title={title} description={description} side="right">
      {children}
    </Tooltip>
  );
};
