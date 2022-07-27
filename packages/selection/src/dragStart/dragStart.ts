import React from 'react';
import { Core, DataInsertAction } from '@minddrop/core';
import { selectionToEventData } from '../utils/selectionToEventData';
import { useSelectionStore } from '../useSelectionStore';
import { getSelection } from '../getSelection';

/**
 * Sets the current selection as a drag event's data transfer data.
 *
 * The data consists of stringified arrays of selection items grouped
 * by resource, with each resource being set as
 * `minddrop-selection/[resource]`.
 *
 * @param core - A MindDrop core instance.
 * @param event - The drag event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 */
export function dragStart(
  core: Core,
  event: DragEvent | React.DragEvent,
  action: DataInsertAction,
): void {
  // Get the current selection as event data
  const selectionData = selectionToEventData();

  // Set the action on the event
  event.dataTransfer.setData('minddrop/action', action);
  // Set the selection data on the event
  Object.keys(selectionData).forEach((key) => {
    event.dataTransfer.setData(key, selectionData[key]);
  });

  // Set the dragging state to `true`
  useSelectionStore.getState().setIsDragging(true);

  // Dispatch a 'selection:drag:start' event
  core.dispatch('selection:drag:start', { event, selection: getSelection() });
}
