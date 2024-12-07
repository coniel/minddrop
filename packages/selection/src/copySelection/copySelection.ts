import React from 'react';
import { Events } from '@minddrop/events';
import { setClipboardData } from '../setClipboardData';
import { getSelection } from '../getSelection';

/**
 * Serializes the current selection as the clipboard event's data transfer data.
 *
 * @param event - The clipboard event.
 * @dispatches selection:clipboard:copy
 */
export function copySelection(
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Set the clipboard event data
  setClipboardData(event, 'copy');

  // Dispatch a selection copy event
  Events.dispatch('selection:copy', {
    event,
    selection: getSelection(),
  });
}
