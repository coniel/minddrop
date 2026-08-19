import { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { DropEventData, useDraggable, useDroppable } from '@minddrop/selection';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icon,
  useTransientState,
} from '@minddrop/ui-primitives';
import {
  useDesignStudio,
  useDesignStudioStore,
  useElement,
} from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { DesignElementsDataKey } from '../constants';
import { handleDropOnDesignElement } from '../handleDropOnDesignElement';
import { handleDropOnGap } from '../handleDropOnGap';
import { FlatDesignElement } from '../types';
import { useHoveredItem } from '../useHoveredItem';
import { hasPagePanels } from '../utils';
import { ElementsTreeDropZone } from './ElementsTreeDropZone';
import { resolveNodeLabel } from './resolveNodeLabel';

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
   * The index of the element within its parent, used to place
   * dropped elements.
   */
  index: number;

  /**
   * Whether the element is the last child of its parent.
   *
   * @default false
   */
  isLastChild?: boolean;

  /**
   * Overrides the node label, used for layout root nodes which
   * display the layout type name.
   */
  label?: string;

  /**
   * Overrides the node icon, used for layout root nodes which
   * display the layout type icon.
   */
  icon?: UiIconName;
}

/**
 * Renders a single node of the layout tree: the element's role or
 * type name, the property it is bound to, and its children. Nodes
 * are drag-and-drop targets, inserting palette items and moving
 * existing elements into the layout.
 */
export const ElementsTreeNode: React.FC<ElementsTreeNodeProps> = ({
  elementId,
  depth,
  index,
  isLastChild = false,
  label,
  icon,
}) => {
  const { t } = useTranslation();
  // Kept in the view's transient state so collapsed branches stay
  // collapsed when the studio remounts
  const [expanded, setExpanded] = useTransientState(
    `tree-node:${elementId}`,
    true,
  );
  const studio = useDesignStudio();
  const layoutId = useLayoutId();
  const element = useElement(elementId);
  // Rows track hover themselves, since a native drag leaves browser
  // hover state stuck on the rows it passed over
  const { hoveredProps } = useHoveredItem(`${layoutId}:${elementId}`);
  // The layout root's ID is shared between layouts, so root nodes
  // are only selected when their layout is the active one
  const isSelected = useDesignStudioStore(
    (state) =>
      state.selectedElementId === elementId &&
      (!layoutId || state.activeLayoutId === layoutId),
  );

  const children = element ? getChildren(element) : null;

  // Regions and the layout root are fixed in place, so they accept
  // drops without being draggable themselves
  const isFixed = elementId === 'root' || isRegion(element);

  // A panelled root arranges its panel regions rather than content:
  // drops are only valid inside the regions, so the root node
  // offers no drop target at all
  const isPanelledRoot =
    element?.type === 'root' &&
    hasPagePanels(studio, element, layoutId ?? undefined);

  const { draggableProps, isDragging } = useDraggable({
    id: elementId,
    type: DesignElementsDataKey,
    data: element,
  });

  // Drops land inside the node when it holds children, and before
  // or after it otherwise
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      // Dropping onto a parent node appends to its children
      if (drop.position === 'inside') {
        const childIds = element && getChildren(element);

        if (!childIds) {
          return;
        }

        handleDropOnGap(
          studio,
          drop,
          elementId,
          childIds.length,
          layoutId ?? undefined,
        );

        return;
      }

      // The bottom edge of an expanded parent reads as the first
      // child position, since its children start right below, so
      // the drop goes inside at the top rather than below the
      // whole subtree
      if (drop.position === 'after' && expanded && element && children) {
        handleDropOnGap(studio, drop, elementId, 0, layoutId ?? undefined);

        return;
      }

      handleDropOnDesignElement(studio, drop, layoutId ?? undefined);
    },
    [studio, element, elementId, layoutId, expanded, children],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    useDroppable({
      index,
      type: 'design-element',
      id: elementId,
      // Fixed nodes are placed by the layout, with nothing to drop
      // before or after them, so they only take drops inside
      // themselves
      axis: isFixed ? 'container' : 'vertical',
      enableInside: !!children,
      isLastChild,
      onDrop: handleDrop,
    });

  if (!element) {
    return null;
  }

  const nodeLabel = resolveNodeLabel(element);
  const resolvedIcon = icon ?? nodeLabel.icon;
  const resolvedLabel = label ?? t(nodeLabel.label);

  // Indentation: one step per depth level, plus base padding
  const indent = `calc(var(--space-2) + var(--space-1) * ${depth})`;

  // Where the node's children start, aligning the child indent
  // guide and the first-child drop line
  const childIndent = `calc(${indent} + 0.375rem)`;

  const dragDropProps = resolveDragDropProps();

  // A panelled root offers no drag or drop at all; other fixed
  // nodes keep their drop target but drop the drag handlers
  function resolveDragDropProps(): Record<string, unknown> {
    if (isPanelledRoot) {
      return {};
    }

    if (isFixed) {
      return droppableProps;
    }

    return { ...draggableProps, ...droppableProps };
  }

  // Selecting is the first job of a click. Once the node holds the
  // selection, further clicks fold it away, so a parent can be
  // collapsed without aiming for the chevron.
  function handleClick() {
    if (children && isSelected) {
      setExpanded(!expanded);

      return;
    }

    studio.selectElement(elementId, layoutId ?? undefined);
  }

  const row = (
    <div
      className="designs-elements-tree-node"
      data-selected={isSelected}
      data-dragging={isDragging}
      data-drop-position={isDraggingOver ? dropIndicatorPosition : undefined}
      data-drop-inside-first={expanded && Boolean(children)}
      style={
        {
          paddingLeft: indent,
          '--designs-tree-child-indent': childIndent,
        } as React.CSSProperties
      }
      onClick={handleClick}
      {...hoveredProps}
      {...dragDropProps}
    >
      {children ? (
        <CollapsibleTrigger
          className="designs-elements-tree-node-chevron-trigger"
          onClick={(event) => event.stopPropagation()}
        >
          <Icon
            name="chevron-down"
            className="designs-elements-tree-node-chevron"
          />
        </CollapsibleTrigger>
      ) : (
        <span className="designs-elements-tree-node-chevron-placeholder" />
      )}
      <Icon name={resolvedIcon} className="designs-elements-tree-node-icon" />
      <span className="designs-elements-tree-node-label">{resolvedLabel}</span>
      <NodeValue nodeLabel={nodeLabel} />
    </div>
  );

  // Leaf elements render the row on its own
  if (!children) {
    return row;
  }

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      {row}
      <CollapsibleContent>
        <div
          className="designs-elements-tree-indent-guide"
          style={{ marginLeft: childIndent }}
        >
          {children.length === 0 && (
            <ElementsTreeDropZone parentId={elementId} />
          )}
          {children.map((childId, childIndex) => (
            <ElementsTreeNode
              key={childId}
              elementId={childId}
              depth={depth + 1}
              index={childIndex}
              isLastChild={childIndex === children.length - 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * Renders the value an element displays: the property it is bound
 * to as a chip, or its static content as plain truncated text.
 * Placeholders are never shown, since they are generated rather
 * than authored.
 */
const NodeValue: React.FC<{
  nodeLabel: ReturnType<typeof resolveNodeLabel>;
}> = ({ nodeLabel }) => {
  // Bound elements show the property name after a bind arrow
  if (nodeLabel.property) {
    return (
      <span className="designs-elements-tree-node-value">
        <Icon
          name="arrow-right"
          className="designs-elements-tree-node-bind-arrow"
        />
        <span className="designs-elements-tree-node-property">
          {nodeLabel.property}
        </span>
      </span>
    );
  }

  // Static elements show their content without an arrow
  if (nodeLabel.staticContent) {
    return (
      <span className="designs-elements-tree-node-static">
        {nodeLabel.staticContent}
      </span>
    );
  }

  return null;
};

/**
 * Returns an element's child IDs, or null when the element cannot
 * contain children.
 */
function getChildren(element: FlatDesignElement): string[] | null {
  if ('children' in element && Array.isArray(element.children)) {
    return element.children;
  }

  return null;
}

/**
 * Whether an element is a layout region, which is placed by its
 * parent layout rather than by the user.
 */
function isRegion(element: FlatDesignElement | undefined): boolean {
  if (!element) {
    return false;
  }

  if (element.type === 'page-panel') {
    return true;
  }

  return (
    element.type === 'container' &&
    'role' in element &&
    element.role === 'page-content'
  );
}
