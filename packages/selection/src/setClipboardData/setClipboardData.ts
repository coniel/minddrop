import React from 'react';
import { DataInsertAction } from '@minddrop/core';
import { selectionToEventData } from '../utils/selectionToEventData';
import { ACTION_DATA_KEY } from '../constants';

/**
 * Sets the current selection as a clipboard event's data.
 *
 * The data consists of stringified arrays of selection items grouped by
 * item type, with each item being set as `minddrop-selection/[type]`.
 *
 * @param event - The clipboard event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 */
export function setClipboardData(
  event: ClipboardEvent | React.ClipboardEvent,
  action: DataInsertAction,
): void {
  // Get the current selection as event data
  const selectionData = selectionToEventData();

  // Set the action on the event
  event.clipboardData?.setData(ACTION_DATA_KEY, action);

  // Set the selection data on the event
  Object.entries(selectionData).forEach(([key, value]) => {
    event.clipboardData?.setData(key, value);
  });
}
