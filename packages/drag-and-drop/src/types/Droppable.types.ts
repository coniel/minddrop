import React from 'react';
import { DragMoveData } from './DragMoveData.types';
import { DropEventData } from './DropEventData.types';
import { DropIndicatorPosition } from './DropPosition.types';

export type DroppableAxis = 'horizontal' | 'vertical' | 'container';

export interface DroppableOptions {
  /**
   * The type of the element which should accept drops.
   */
  type: string;

  /**
   * The ID of the element which should accept drops.
   */
  id: string;

  /**
   * The index of the element which should accept drops, if the target
   * is an item of a list.
   */
  index?: number;

  /**
   * Callback fired when the user drops an element over the droppable
   * element.
   */
  onDrop?: (data: DropEventData) => void;

  /**
   * Callback fired as a drag moves over the droppable element.
   */
  onDragMove?: (data: DragMoveData) => void;

  /**
   * The axis on which to calculate before/after drop positions.
   * Can be one of:
   * - 'horizontal': elements can be dropped to the left/right of the element
   * - 'vertical': elements can be dropped above/below the element
   * - 'container': elements can only be dropped inside the element
   *
   * @default 'container'
   */
  axis?: DroppableAxis;

  /**
   * Whether to accept drops inside the element. If false, a drop
   * anywhere on the element is before or after it, divided at its
   * midpoint.
   *
   * Only applicable if `axis` is other than 'container'.
   *
   * @default false
   */
  enableInside?: boolean;

  /**
   * The share of the element's extent, at each end, which counts as
   * before or after it.
   *
   * Only applicable if `enableInside` is true.
   *
   * @default 0.25
   */
  edgeThreshold?: number;

  /**
   * Whether the element is the last child of its parent. If true, a
   * drop after it resolves to the 'end' indicator position rather
   * than 'after'.
   *
   * @default false
   */
  isLastChild?: boolean;

  /**
   * The data types the element accepts drops of. A drag containing
   * none of them is ignored and falls through to ancestor drop
   * targets.
   *
   * When omitted, every drag is accepted.
   */
  accepts?: string[];

  /**
   * The data types the element accepts drops of from native drags
   * only, in addition to `accepts`. A drag within the app carrying
   * only these types is ignored.
   */
  nativeAccepts?: string[];

  /**
   * Whether an accepted drag is claimed. A claimed drag does not
   * reach ancestor drop targets.
   *
   * @default true
   */
  claim?: boolean;

  /**
   * Whether the element reacts only to drags over its own empty
   * space, with no descendant under the pointer. Drags over its
   * descendants are ignored.
   *
   * @default false
   */
  directOnly?: boolean;
}

export interface DroppableProps {
  /**
   * Registers the element as a drop target.
   */
  ref: (element: HTMLElement | null) => VoidFunction | void;

  /**
   * Marks the element as a drop target.
   */
  'data-droppable-key': string;

  /**
   * Reacts to a native drag from outside the app moving over the
   * element.
   */
  onDragOver: (event: React.DragEvent) => void;

  /**
   * Reacts to a native drag from outside the app entering the
   * element.
   */
  onDragEnter: (event: React.DragEvent) => void;

  /**
   * Reacts to a native drag from outside the app leaving the
   * element.
   */
  onDragLeave: (event: React.DragEvent) => void;

  /**
   * Takes a native drop from outside the app.
   */
  onDrop: (event: React.DragEvent) => void;

  /**
   * Clears the element's dragged-over state as a native drop anywhere
   * within it begins. Runs before the drop target which takes the
   * drop handles it.
   */
  onDropCapture: (event: React.DragEvent) => void;
}

export interface DroppableOverState {
  /**
   * Whether the droppable element is currently being dragged over.
   */
  isDraggingOver: boolean;

  /**
   * The position of the drop indicator, relative to the droppable
   * element.
   */
  dropIndicatorPosition: DropIndicatorPosition;
}
