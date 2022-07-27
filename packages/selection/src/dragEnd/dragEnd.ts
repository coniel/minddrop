import React from 'react';
import { Core } from '@minddrop/core';
import { useSelectionStore } from '../useSelectionStore';
import { getSelection } from '../getSelection';

/**
 * Toggles the dragging state to `false`. Dispatches a
 * `selection:drag:end` event.
 *
 * @param core - A MindDrop core instance.
 * @param event - The drag end event.
 */
export function dragEnd(core: Core, event: DragEvent | React.DragEvent): void {
  // Set the dragging state to `false`
  useSelectionStore.getState().setIsDragging(false);

  // Dispatch a 'selection:drag:end' event
  core.dispatch('selection:drag:end', { event, selection: getSelection() });
}
