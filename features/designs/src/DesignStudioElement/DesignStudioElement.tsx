import React, { useCallback, useMemo } from 'react';
import { DesignStudioStore, useElement } from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { elementUIMap } from '../design-elements';
import { FlatDesignElement } from '../types';
import { useDesignElementDragDrop } from '../useDesignElementDragDrop';

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
  const layoutId = useLayoutId();

  // Panel regions and the content region are fixed in place: they
  // can't be dragged, but still accept drops so content can be
  // dropped inside them
  const isRegion =
    element.type === 'page-panel' ||
    (element.type === 'container' && element.role === 'content');

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
      DesignStudioStore.selectElement(element.id, layoutId ?? undefined);
    },
    [element.id, layoutId],
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
  // need interactive studio behaviour like image pickers or
  // FlexDropContainer). Otherwise fall back to DisplayComponent.
  if (ui.StudioComponent) {
    return <ui.StudioComponent element={element} rootProps={rootProps} />;
  }

  // Every element type which has children provides a StudioComponent, so
  // only leaf elements reach the display fallback. Their flat shape adds a
  // `parent` field but is otherwise a DesignElement.
  if ('children' in element) {
    return null;
  }

  return <ui.DisplayComponent element={element} rootProps={rootProps} />;
};
