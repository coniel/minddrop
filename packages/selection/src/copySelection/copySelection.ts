import React from 'react';
import { Events } from '@minddrop/events';
import { SelectionCopiedEvent } from '../events';
import { getSelection } from '../getSelection';
import { serializeSelectionToDataTransfer } from '../utils';
import { serializeSelection } from '../utils';

/**
 * Serializes the current selection as the clipboard event's data transfer data.
 *
 * @param event - The clipboard event.
 * @dispatches selection:copied
 */
export function copySelection(
  event?: ClipboardEvent | React.ClipboardEvent,
): void {
  if (event) {
    // Ensure the clipboard event has a data transfer object
    if (!event.clipboardData) {
      return;
    }

    // Set the clipboard event data
    serializeSelectionToDataTransfer(event.clipboardData);
  } else {
    const data = serializeSelection();

    const clipboardItem = new ClipboardItem(data);

    // Copy the data to the clipboard
    navigator.clipboard.write([clipboardItem]);
  }

  // Dispatch a selection copied event
  Events.dispatch(SelectionCopiedEvent, {
    event,
    selection: getSelection(),
  });
}
