import { DRAG_THRESHOLD } from './constants';
import { DragEndedEvent, DragStartedEvent } from './events';

// The events the package dispatches. Const-asserted so the names
// keep their literal types. The event data map is keyed by them.
export const events = {
  Started: DragStartedEvent,
  Ended: DragEndedEvent,
} as const;

export const constants = {
  DragThreshold: DRAG_THRESHOLD,
};

export { useDraggable } from './useDraggable';
export { useDroppable } from './useDroppable';
export { DragStore as Store, useActiveDrag, useIsDragging } from './DragStore';
export { getActiveDrag } from './getActiveDrag';
export { subscribeToActiveDrag } from './subscribeToActiveDrag';
export { getPointerPosition, subscribeToMove } from './PointerPositionStore';
export { getDragPreviewElement as getPreviewElement } from './getDragPreviewElement';
export { resolveDraggableElements } from './resolveDraggableElements';
export { dragContainsType } from './utils';
