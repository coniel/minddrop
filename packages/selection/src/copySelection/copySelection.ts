import React from 'react';
import { Events } from '@minddrop/events';
import { getSelection } from '../getSelection';
import { setClipboardData } from '../setClipboardData';
import { serializeSelection } from '../utils/serializeSelection';

/**
 * Serializes the current selection as the clipboard event's data transfer data.
 *
 * @param event - The clipboard event.
 * @dispatches selection:clipboard:copy
 */
export function copySelection(
  event?: ClipboardEvent | React.ClipboardEvent,
): void {
  if (event) {
    // Set the clipboard event data
    setClipboardData(event, 'copy');
  } else {
    const data = serializeSelection();

    const clipboardItem = new ClipboardItem(data);

    // Copy the data to the clipboard
    navigator.clipboard.write([clipboardItem]);
  }

  // Dispatch a selection copy event
  Events.dispatch('selection:copy', {
    event,
    selection: getSelection(),
  });
}
