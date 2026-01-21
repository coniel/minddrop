import React from 'react';
import { Events } from '@minddrop/events';
import { getSelection } from '../getSelection';
import { useSelectionStore } from '../useSelectionStore';
import { serializeSelectionToDataTransfer } from '../utils/selectionToEventData';

/**
 * Serializes the current selection to a drag event's data transfer data.
 *
 * @param event - The drag event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 *
 * @dispatches selection:drag:start
 */
export function dragStart(event: DragEvent | React.DragEvent): void {
  if (!event.dataTransfer) {
    return;
  }

  // Get the current selection as event data
  serializeSelectionToDataTransfer(event.dataTransfer);

  // Set the dragging state to `true`
  useSelectionStore.getState().setIsDragging(true);

  // Dispatch a 'selection:drag:start' event
  Events.dispatch('selection:drag:start', { event, selection: getSelection() });
}
