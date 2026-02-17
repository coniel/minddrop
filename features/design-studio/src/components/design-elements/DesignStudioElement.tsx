import React, { ReactElement } from 'react';
import { useElement } from '../../DesignStudioStore';
import { FlatDesignElement } from '../../types';
import { DesignElementDragDropHandler } from '../DesignElementDragDropHandler';
import { DesignStudioCardElement } from './DesignStudioCardElement';
import { DesignStudioImagePropertyElement } from './DesignStudioImagePropertyElement';
import { DesignStudioTextPropertyElement } from './DesignStudioTextPropertyElement';

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

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
  index,
  isLastChild = false,
  gap = 0,
}) => {
  const element = useElement(elementId);
  let elementComponent: ReactElement | null = null;

  if (!element) {
    return null;
  }

  switch (element.type) {
    case 'text-property':
      elementComponent = <DesignStudioTextPropertyElement element={element} />;
      break;
    case 'image-property':
      elementComponent = <DesignStudioImagePropertyElement element={element} />;
      break;
  }

  if (elementComponent) {
    return (
      <DesignElementDragDropHandler
        index={index}
        element={element}
        isLastChild={isLastChild}
        gap={gap}
      >
        {elementComponent}
      </DesignElementDragDropHandler>
    );
  }

  switch (element.type) {
    case 'card':
      return <DesignStudioCardElement element={element} />;
    default:
      return null;
  }
};
