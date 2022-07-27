import React from 'react';
import { DataInsertAction } from '@minddrop/core';
import { selectionToEventData } from '../selectionToEventData';

/**
 * Sets the current selection as a clipboard event's data.
 *
 * The data consists of stringified arrays of selection items grouped
 * by resource, with each resource being set as
 * `minddrop-selection/[resource]`.
 *
 * @param event - The clipboard event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 */
export function setClipboardData(
  event: ClipboardEvent | React.ClipboardEvent,
  action: DataInsertAction,
): void {
  // Clear default clipboard data
  event.clipboardData.clearData();

  // Get the current selection as event data
  const selectionData = selectionToEventData();

  // Set the action on the event
  event.clipboardData.setData('minddrop/action', action);
  // Set the selection data on the event
  Object.keys(selectionData).forEach((key) => {
    event.clipboardData.setData(key, selectionData[key]);
  });

  // Needed when setting custom clipboard data
  event.preventDefault();
}
