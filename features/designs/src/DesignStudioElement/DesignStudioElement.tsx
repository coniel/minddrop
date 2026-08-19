import { useCallback, useMemo } from 'react';
import {
  DesignStudioStore,
  useDesignStudio,
  useElement,
} from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { elementUIMap } from '../design-elements';
import { FlatChildDesignElement, FlatDesignElement } from '../types';
import { useDesignElementDragDrop } from '../useDesignElementDragDrop';
import { StudioLeafElement } from './StudioLeafElement';

export interface DesignStudioElementProps {
  /**
   * The ID of the element to render.
   */
  elementId: string;

  /**
   * The index of the element within its parent.
   */
  index: number;

  /**
   * Whether the element is the last child of its parent.
   *
   * @default false
   */
  isLastChild?: boolean;
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
}) => {
  const element = useElement(elementId);

  if (!element) {
    return null;
  }

  return (
    <DesignStudioElementInner
      element={element}
      index={index}
      isLastChild={isLastChild}
    />
  );
};

const DesignStudioElementInner: React.FC<{
  element: FlatDesignElement;
  index: number;
  isLastChild: boolean;
}> = ({ element, index, isLastChild }) => {
  const studio = useDesignStudio();
  const layoutId = useLayoutId();

  // Panel regions and the content region are fixed in place: they
  // can't be dragged, but still accept drops so content can be
  // dropped inside them
  const isRegion =
    element.type === 'page-panel' ||
    (element.type === 'container' &&
      'role' in element &&
      element.role === 'page-content');

  const { dragDropProps, isDragging } = useDesignElementDragDrop({
    index,
    element,
    isLastChild,
    draggable: !isRegion,
  });

  // Select the element to open its style editor, activating the
  // containing layout
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      // Shift-clicking selects the containing element instead, for
      // reaching a parent covered entirely by its children, and
      // climbs a level further per click towards the root
      if (event.shiftKey && 'parent' in element) {
        studio.selectElement(
          resolveShiftClickTarget(studio, element, layoutId ?? undefined),
          layoutId ?? undefined,
        );

        return;
      }

      studio.selectElement(element.id, layoutId ?? undefined);
    },
    [studio, element, layoutId],
  );

  // Build the props that the component must spread
  // on its outermost DOM element
  const rootProps = useMemo(
    () => ({
      ...dragDropProps,
      onClick: handleClick,
      'data-element-id': element.id,
      style: isDragging ? { opacity: 0.5 } : undefined,
    }),
    [dragDropProps, handleClick, element.id, isDragging],
  );

  const ui = elementUIMap[element.type];

  if (!ui) {
    return null;
  }

  // Use the StudioComponent when one exists (for elements that
  // need interactive studio behaviour like drop containers or
  // icon pickers)
  if (ui.StudioComponent) {
    return <ui.StudioComponent element={element} rootProps={rootProps} />;
  }

  // Every element type which has children provides a StudioComponent, so
  // only leaf elements reach the display fallback
  if ('children' in element) {
    return null;
  }

  // Leaf elements render their display component inside a wrapper
  // carrying the interaction props
  return (
    <StudioLeafElement element={element} rootProps={rootProps}>
      <ui.DisplayComponent element={element} />
    </StudioLeafElement>
  );
};

/**
 * Resolves the element a shift-click selects: the clicked
 * element's parent, or one level above the current selection when
 * it already sits on the clicked element's ancestor chain, so
 * repeated shift-clicks keep climbing towards the root.
 */
function resolveShiftClickTarget(
  studio: DesignStudioStore,
  element: FlatChildDesignElement,
  layoutId?: string,
): string {
  // The clicked element's ancestor chain, ending at the root
  const chain: string[] = [element.id];
  let parentId: string | undefined = element.parent;

  while (parentId) {
    chain.push(parentId);

    const parent: FlatDesignElement | undefined = studio.getDesignElement(
      parentId,
      layoutId,
    );

    parentId = parent && 'parent' in parent ? parent.parent : undefined;
  }

  // The selection already sits on the chain: climb one level
  // above it, staying on the root once reached
  const selectedIndex = chain.indexOf(studio.getSelectedElementId() ?? '');

  if (selectedIndex !== -1) {
    return chain[Math.min(selectedIndex + 1, chain.length - 1)];
  }

  return element.parent;
}
