import React from 'react';
import { Events } from '@minddrop/events';
import { setClipboardData } from '../utils';
import { getSelection } from '../getSelection';

/**
 * Sets the current selection as a clipboard event's data.
 * The data consists of stringified arrays of selection
 * items grouped by type, with each type being set
 * as `minddrop-selection/[type]`.
 *
 * @param event - The clipboard event.
 * @dispatches 'selection:clipboard:cut'
 */
export function cutSelection(
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Set the clipboard event data
  setClipboardData(event, 'cut');

  // Dispatch a 'selection:clipboard:cut' event
  Events.dispatch('selection:clipboard:cut', {
    event,
    selection: getSelection(),
  });
}
