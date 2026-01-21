import React from 'react';
import { serializeSelectionToDataTransfer } from '../utils/selectionToEventData';

/**
 * Serializes the current selection to a clipboard event's data.
 *
 * @param event - The clipboard event for which to set the data.
 */
export function setClipboardData(
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  if (!event.clipboardData) {
    return;
  }

  // Serialize the current selection to the event's data transfer
  serializeSelectionToDataTransfer(event.clipboardData);
}
