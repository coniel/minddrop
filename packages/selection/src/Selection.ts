import { SelectionItemTypeNotRegisteredError } from './errors';
import {
  SelectionClearedEvent,
  SelectionCopiedEvent,
  SelectionDeletedEvent,
  SelectionDragEndedEvent,
  SelectionDragStartedEvent,
  SelectionItemsAddedEvent,
  SelectionItemsRemovedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  ItemsAdded: SelectionItemsAddedEvent,
  ItemsRemoved: SelectionItemsRemovedEvent,
  Cleared: SelectionClearedEvent,
  Copied: SelectionCopiedEvent,
  Deleted: SelectionDeletedEvent,
  DragStarted: SelectionDragStartedEvent,
  DragEnded: SelectionDragEndedEvent,
} as const;

export const errors = {
  ItemTypeNotRegistered: SelectionItemTypeNotRegisteredError,
};

export { deleteSelection as delete } from './deleteSelection';
export { getSelection as get } from './getSelection';
export { getSelectionIds as getIds } from './getSelectionIds';
export { isSelected } from './isSelected';
export { selectionIsEmpty as isEmpty } from './selectionIsEmpty';
export { addToSelection as add } from './addToSelection';
export { removeFromSelection as remove } from './removeFromSelection';
export { select } from './select';
export { clearSelection as clear } from './clearSelection';
export { copySelection as copy } from './copySelection';
export { SelectionStore as Store } from './SelectionStore';
export { useIsDragging } from './SelectionStore';
export { useSelection as use } from './useSelection';
export { useSelectionItem as useItem } from './useSelectionItem';
export { useSelectable } from './useSelectable';
export { useDraggable } from './useDraggable';
export { useDroppable } from './useDroppable';
export { dragContainsType, toMimeType } from './utils';
