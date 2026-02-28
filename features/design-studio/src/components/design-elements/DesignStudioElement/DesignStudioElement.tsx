import React, { ReactElement, useCallback } from 'react';
import { propsToClass } from '@minddrop/ui-primitives';
import {
  DesignStudioStore,
  useDesignStudioStore,
  useElement,
} from '../../../DesignStudioStore';
import { ContainerElementStyle } from '@minddrop/designs';
import { FlatContainerDesignElement, FlatDesignElement } from '../../../types';
import { useDesignElementDragDrop } from '../../useDesignElementDragDrop';
import { DesignStudioContainerElement } from '../DesignStudioContainerElement';
import { DesignStudioFormattedTextElement } from '../DesignStudioFormattedTextElement';
import { DesignStudioImageElement } from '../DesignStudioImageElement';
import { DesignStudioNumberElement } from '../DesignStudioNumberElement';
import { DesignStudioTextElement } from '../DesignStudioTextElement';
import './DesignStudioElement.css';

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

  /**
   * The gap between the elements within the same parent.
   *
   * @default 0
   */
  gap?: number;
}

export interface ElementComponentProps {
  element: FlatDesignElement;
  index: number;
}

function getElementComponent(element: FlatDesignElement): ReactElement | null {
  switch (element.type) {
    case 'container':
      return (
        <DesignStudioContainerElement
          element={element as FlatContainerDesignElement}
        />
      );
    case 'text':
      return <DesignStudioTextElement element={element} />;
    case 'formatted-text':
      return <DesignStudioFormattedTextElement element={element} />;
    case 'number':
      return <DesignStudioNumberElement element={element} />;
    case 'image':
      return <DesignStudioImageElement element={element} />;
    default:
      return null;
  }
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
  gap = 0,
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
      gap={gap}
    />
  );
};

const DesignStudioElementInner: React.FC<{
  element: FlatDesignElement;
  index: number;
  isLastChild: boolean;
  gap: number;
}> = ({ element, index, isLastChild, gap }) => {
  const isSelected = useDesignStudioStore(
    (state) => state.highlightedElementId === element.id,
  );
  const isFading = useDesignStudioStore(
    (state) => state.fadingHighlightElementId === element.id,
  );

  const { dragDropProps, dropIndicator, isDragging } = useDesignElementDragDrop(
    {
      index,
      element,
      isLastChild,
      gap,
    },
  );

  // Select the element to open its style editor
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      DesignStudioStore.getState().selectElement(element.id);
    },
    [element.id],
  );

  const elementComponent = getElementComponent(element);

  if (!elementComponent) {
    return null;
  }

  // Determine if this element should stretch within its parent.
  // Images always stretch; containers stretch based on their
  // stretch property.
  const shouldStretch =
    element.type === 'image' ||
    (element.type === 'container' &&
      (element.style as ContainerElementStyle).stretch);

  return (
    <div
      className="design-studio-element"
      data-element-id={element.id}
      style={shouldStretch ? { alignSelf: 'stretch' } : undefined}
      {...dragDropProps}
    >
      <div
        className={propsToClass('design-studio-element-inner', { isDragging, isSelected, isFading })}
        onClick={handleClick}
        onAnimationEnd={isFading ? () => DesignStudioStore.getState().clearFadingHighlight() : undefined}
      >
        {elementComponent}
      </div>
      {dropIndicator}
    </div>
  );
};
