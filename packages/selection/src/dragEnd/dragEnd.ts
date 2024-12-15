import React from 'react';
import { Events } from '@minddrop/events';
import { getSelection } from '../getSelection';
import { useSelectionStore } from '../useSelectionStore';

/**
 * Toggles the dragging state to `false`. Dispatches a
 * `selection:drag:end` event.
 *
 * @param event - The drag end event.
 * @dispatches 'selection:drag:end'
 */
export function dragEnd(event: DragEvent | React.DragEvent): void {
  // Set the dragging state to `false`
  useSelectionStore.getState().setIsDragging(false);

  // Dispatch a 'selection:drag:end' event
  Events.dispatch('selection:drag:end', { event, selection: getSelection() });
}
