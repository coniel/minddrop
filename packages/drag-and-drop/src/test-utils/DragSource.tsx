import React from 'react';
import { DragOrigin } from '../types';
import { useDraggable } from '../useDraggable';

export interface DragSourceProps {
  /**
   * The drag's data, keyed by data type.
   */
  data: Record<string, unknown>;

  /**
   * The ID of the dragged item.
   *
   * @default 'drag-source'
   */
  id?: string;

  /**
   * The type of the dragged item.
   *
   * @default 'drag-source'
   */
  type?: string;

  /**
   * Where the drag starts from.
   */
  origin?: DragOrigin;

  /**
   * The test ID the element is found by.
   *
   * @default 'drag-source'
   */
  testId?: string;
}

/**
 * Renders an element draggable with the given data.
 */
export const DragSource: React.FC<DragSourceProps> = ({
  data,
  id = 'drag-source',
  type = 'drag-source',
  origin,
  testId = 'drag-source',
}) => {
  const { draggableProps } = useDraggable({ id, type, data, origin });

  return <div data-testid={testId} {...draggableProps} />;
};
