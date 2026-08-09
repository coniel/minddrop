import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icon,
  Tooltip,
} from '@minddrop/ui-primitives';
import { DesignStudioStore, useElement } from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { MappableIndicator } from '../MappableIndicator';
import {
  elementCompatiblePropertyTypesMap,
  elementIconMap,
  elementLabelMap,
  propertyTypeLabelMap,
} from '../constants';
import { designStudioCanvasStore } from '../designStudioCanvas';
import { FlatDesignElement } from '../types';

export interface ElementsTreeNodeProps {
  /**
   * The ID of the element the node represents.
   */
  elementId: string;

  /**
   * The nesting depth of the node, used for indentation.
   */
  depth: number;

  /**
   * Overrides the node label (used for layout root nodes, which
   * display the layout name).
   */
  label?: string;

  /**
   * Overrides the node icon (used for layout root nodes, which
   * display the layout type icon).
   */
  icon?: UiIconName;
}

function hasChildren(
  element: FlatDesignElement,
): element is FlatDesignElement & { children: string[] } {
  return 'children' in element && Array.isArray(element.children);
}

// Region children of a panelled page root get a role/side specific
// label instead of their generic element type label
function getRegionLabelKey(element: FlatDesignElement): TranslationKey | null {
  if (element.type === 'page-panel') {
    if (element.side === 'left') {
      return 'designs.page-panels.left.label';
    }

    return 'designs.page-panels.right.label';
  }

  if (element.type === 'container' && element.role === 'content') {
    return 'designs.page-panels.content.label';
  }

  return null;
}

export const ElementsTreeNode: React.FC<ElementsTreeNodeProps> = ({
  elementId,
  depth,
  label,
  icon,
}) => {
  const { t } = useTranslation();
  const layoutId = useLayoutId();
  const element = useElement(elementId);
  // The layout root's ID is shared between layouts, so root nodes
  // are only selected when their layout is the active one
  const isSelected = DesignStudioStore(
    (state) =>
      state.selectedElementId === elementId &&
      (!layoutId || state.activeLayoutId === layoutId),
  );

  if (!element) {
    return null;
  }

  const resolvedIcon = icon || elementIconMap[element.type] || 'box';
  const labelKey = getRegionLabelKey(element) || elementLabelMap[element.type];
  const resolvedLabel = label || (labelKey ? t(labelKey) : element.type);
  const isContainer = hasChildren(element) && element.children.length > 0;

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
    DesignStudioStore.getState().selectElement(
      elementId,
      layoutId ?? undefined,
    );
  };

  // Double-clicking a layout root node centers the viewport on
  // the layout's frame
  const handleDoubleClick = () => {
    if (elementId === 'root' && layoutId) {
      designStudioCanvasStore.centerOnNode(layoutId);
    }
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
          title="design-studio.mappable.tooltip"
          description={typeLabels}
        >
          <div
            className="elements-tree-node"
            data-selected={isSelected}
            style={{ paddingLeft: indent }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
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
            <Icon name={resolvedIcon} className="elements-tree-node-icon" />
            <span className="elements-tree-node-label">{resolvedLabel}</span>
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
      title="design-studio.mappable.tooltip"
      description={typeLabels}
    >
      <div
        className="elements-tree-node"
        data-selected={isSelected}
        style={{ paddingLeft: indent }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <span className="elements-tree-node-chevron-placeholder" />
        <Icon name={resolvedIcon} className="elements-tree-node-icon" />
        <span className="elements-tree-node-label">{resolvedLabel}</span>
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
  title: TranslationKey;
  description: string;
  children: React.ReactElement;
}> = ({ showMappable, title, description, children }) => {
  if (!showMappable) {
    return children;
  }

  return (
    <Tooltip title={title} description={<>{description}</>} side="right">
      {children}
    </Tooltip>
  );
};
