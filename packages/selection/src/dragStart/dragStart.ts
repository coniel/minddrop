import React from 'react';
import { Events } from '@minddrop/events';
import { DataInsertAction } from '@minddrop/core';
import { selectionToEventData } from '../utils/selectionToEventData';
import { useSelectionStore } from '../useSelectionStore';
import { getSelection } from '../getSelection';
import { ACTION_DATA_KEY } from '../constants';

/**
 * Sets the current selection as a drag event's data transfer data.
 *
 * The data consists of stringified arrays of selection items grouped
 * by resource, with each resource being set as
 * `minddrop-selection/[resource]`.
 *
 * @param event - The drag event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 * @dispatches 'selection:drag:start'
 */
export function dragStart(
  event: DragEvent | React.DragEvent,
  action: DataInsertAction,
): void {
  // Get the current selection as event data
  const selectionData = selectionToEventData();

  // Set the action on the event
  event.dataTransfer?.setData(ACTION_DATA_KEY, action);

  // Set the selection data on the event
  Object.entries(selectionData).forEach(([key, value]) => {
    event.dataTransfer?.setData(key, value);
  });

  // Set the dragging state to `true`
  useSelectionStore.getState().setIsDragging(true);

  // Dispatch a 'selection:drag:start' event
  Events.dispatch('selection:drag:start', { event, selection: getSelection() });
}
