import { SelectionItem } from './types';

export const SelectionItemsAddedEvent = 'selection:items:added';
export const SelectionItemsRemovedEvent = 'selection:items:removed';
export const SelectionClearedEvent = 'selection:cleared';
export const SelectionCopiedEvent = 'selection:copied';
export const SelectionDeletedEvent = 'selection:deleted';

export type SelectionItemsAddedEventData = SelectionItem[];
export type SelectionItemsRemovedEventData = SelectionItem[];
export type SelectionClearedEventData = SelectionItem[];
export type SelectionCopiedEventData = {
  event?: ClipboardEvent | React.ClipboardEvent;
  selection: SelectionItem[];
};
export type SelectionDeletedEventData = SelectionItem[];

/******************************************************************************
 * Drag and drop events
 *****************************************************************************/

export const SelectionDragStartedEvent = 'selection:drag:started';
export const SelectionDragEndedEvent = 'selection:drag:ended';

type DragEventData = {
  event: DragEvent | React.DragEvent;
  selection: SelectionItem[];
};

export type SelectionDragStartedEventData = DragEventData;
export type SelectionDragEndedEventData = DragEventData;
