import React, { ReactElement } from 'react';
import { useElement } from '../../../DesignStudioStore';
import { FlatDesignElement } from '../../../types';
import { useDesignElementDragDrop } from '../../useDesignElementDragDrop';
import { DesignStudioTextElement } from '../DesignStudioTextElement';
import './DesignStudioElement.css';
import { propsToClass } from '@minddrop/ui-primitives';

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
    case 'text':
      return <DesignStudioTextElement element={element} />;
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
  const { dragDropProps, dropIndicator, isDragging } = useDesignElementDragDrop(
    {
      index,
      element,
      isLastChild,
      gap,
    },
  );

  const elementComponent = getElementComponent(element);

  if (!elementComponent) {
    return null;
  }

  return (
    <div className="design-studio-element" {...dragDropProps}>
      <div
        className={propsToClass('design-studio-element-inner', { isDragging })}
      >
        {elementComponent}
      </div>
      {dropIndicator}
    </div>
  );
};
