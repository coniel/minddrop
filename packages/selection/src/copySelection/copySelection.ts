import React from 'react';
import { Core } from '@minddrop/core';
import { setClipboardData } from '../utils';
import { getSelection } from '../getSelection';

/**
 * Sets the current selection as a clipboard event's data.
 * The data consists of stringified arrays of selection
 * items grouped by item type, with each resource being set
 * as `minddrop-selection/[type]`.
 *
 * Dispatches a `selection:clipboard:copy` event.
 *
 * @param core - A MindDrop core instance.
 * @param event - The clipboard event.
 */
export function copySelection(
  core: Core,
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Set the clipboard event data
  setClipboardData(event, 'copy');

  // Dispatch a 'selection:clipboard:copy' event
  core.dispatch('selection:clipboard:copy', {
    event,
    selection: getSelection(),
  });
}
