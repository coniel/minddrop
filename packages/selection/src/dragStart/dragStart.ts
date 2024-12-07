import React from 'react';
import { Events } from '@minddrop/events';
import { DataInsertAction } from '@minddrop/core';
import { serializeSelectionToDataTransfer } from '../utils/selectionToEventData';
import { useSelectionStore } from '../useSelectionStore';
import { getSelection } from '../getSelection';
import { ACTION_DATA_KEY } from '../constants';

/**
 * Serializes the current selection to a drag event's data transfer data.
 *
 * @param event - The drag event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 *
 * @dispatches selection:drag:start
 */
export function dragStart(
  event: DragEvent | React.DragEvent,
  action: DataInsertAction,
): void {
  if (!event.dataTransfer) {
    return;
  }

  // Get the current selection as event data
  serializeSelectionToDataTransfer(event.dataTransfer);

  // Set the action on the event
  event.dataTransfer?.setData(ACTION_DATA_KEY, action);

  // Set the dragging state to `true`
  useSelectionStore.getState().setIsDragging(true);

  // Dispatch a 'selection:drag:start' event
  Events.dispatch('selection:drag:start', { event, selection: getSelection() });
}
