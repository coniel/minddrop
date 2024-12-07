import React from 'react';
import { DataInsertAction } from '@minddrop/core';
import { serializeSelectionToDataTransfer } from '../utils/selectionToEventData';
import { ACTION_DATA_KEY } from '../constants';

/**
 * Serializes the current selection to a clipboard event's data.
 *
 * @param event - The clipboard event for which to set the data.
 * @param action - The data transfer action to assign to the event.
 */
export function setClipboardData(
  event: ClipboardEvent | React.ClipboardEvent,
  action: DataInsertAction,
): void {
  if (!event.clipboardData) {
    return;
  }

  // Serialize the current selection to the event's data transfer
  serializeSelectionToDataTransfer(event.clipboardData);

  // Set the action on the event
  event.clipboardData?.setData(ACTION_DATA_KEY, action);
}
