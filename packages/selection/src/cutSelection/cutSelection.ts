import React from 'react';
import { Events } from '@minddrop/events';
import { setClipboardData } from '../setClipboardData';
import { getSelection } from '../getSelection';
import { deleteSelectionItems } from '../utils/deleteSelectionItems';

/**
 * Serializes the current selection as the clipboard event's data transfer data
 * and deletes the selection.
 *
 * @param event - The clipboard event.
 * @dispatches selection:clipboard:cut
 */
export function cutSelection(
  event: ClipboardEvent | React.ClipboardEvent,
): void {
  // Ger the current selection
  const selection = getSelection();

  // Set the clipboard event data
  setClipboardData(event, 'cut');

  // Delete the selection
  deleteSelectionItems();

  // Dispatch a selection cut event
  Events.dispatch('selection:cut', {
    event,
    selection,
  });
}
