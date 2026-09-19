import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { DragStore } from '../DragStore';
import { DraggablesRegistry } from '../DraggablesRegistry';
import { DroppablesRegistry } from '../DroppablesRegistry';
import { cancelDrag } from '../cancelDrag';

// The document's own hit testing, restored after a test stubs it
const elementFromPoint = document.elementFromPoint;

/**
 * Sets up the drag and drop test environment.
 */
export function setup(): void {}

/**
 * Resets the drag and drop test environment between tests.
 */
export function cleanup(): void {
  // Unmount the rendered components
  cleanupRender();

  // End the drag a test left in progress
  cancelDrag();

  // Fire the click an ended drag swallows. Otherwise the next test's
  // first click is swallowed.
  window.dispatchEvent(new MouseEvent('click'));

  // Reset the drag state, the registries and the document
  DragStore.getState().clear();
  DroppablesRegistry.clear();
  DraggablesRegistry.clear();
  document.documentElement.removeAttribute('data-dragging');
  document.elementFromPoint = elementFromPoint;

  // Reset the events and mocks
  Events.tests.cleanup();
  vi.clearAllMocks();
}
