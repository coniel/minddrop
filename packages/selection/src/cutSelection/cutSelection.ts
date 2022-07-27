import React from 'react';
import { Core } from '@minddrop/core';
import { setClipboardData } from '../utils';
import { getSelection } from '../getSelection';

/**
 * Sets the current selection as a clipboard event's data.
 * The data consists of stringified arrays of selection
 * items grouped by resource, with each resource being set
 * as `minddrop-selection/[resource]`.
 *
 * Dispatches a `selection:clipboard:cut` event.
 *
 * @param core - A MindDrop core instance.
 * @param event - The clipboard event.
 */
export function cutSelection(
  core: Core,
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Set the clipboard event data
  setClipboardData(event, 'cut');

  // Dispatch a 'selection:clipboard:cut' event
  core.dispatch('selection:clipboard:cut', {
    event,
    selection: getSelection(),
  });
}
