import React from 'react';
import { Events } from '@minddrop/events';
import { setClipboardData } from '../utils';
import { getSelection } from '../getSelection';

/**
 * Sets the current selection as a clipboard event's data.
 * The data consists of stringified arrays of selection
 * items grouped by item type, with each resource being set
 * as `minddrop-selection/[type]`.
 *
 * @param event - The clipboard event.
 * @dispatches 'selection:clipboard:copy'
 */
export function copySelection(
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Set the clipboard event data
  setClipboardData(event, 'copy');

  // Dispatch a 'selection:clipboard:copy' event
  Events.dispatch('selection:clipboard:copy', {
    event,
    selection: getSelection(),
  });
}
