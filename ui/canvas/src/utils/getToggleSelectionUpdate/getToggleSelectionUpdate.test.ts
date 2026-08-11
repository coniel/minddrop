import { describe, expect, it } from 'vitest';
import { createCanvasStore } from '../../createCanvasStore';
import { CanvasState } from '../../types';
import { getToggleSelectionUpdate } from './getToggleSelectionUpdate';

// Returns a canvas state with the given values applied
function canvasState(values: Partial<CanvasState>): CanvasState {
  return { ...createCanvasStore().useStore.getState(), ...values };
}

describe('getToggleSelectionUpdate', () => {
  it('adds an unselected ID', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1'] },
    });

    expect(getToggleSelectionUpdate(state, 'nodes', 'node-2')).toEqual({
      selection: { type: 'nodes', ids: ['node-1', 'node-2'] },
      selectionPoint: null,
    });
  });

  it('removes a selected ID', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1', 'node-2'] },
    });

    expect(getToggleSelectionUpdate(state, 'nodes', 'node-1')).toEqual({
      selection: { type: 'nodes', ids: ['node-2'] },
      selectionPoint: null,
    });
  });

  it('replaces a selection of another type', () => {
    const state = canvasState({
      selection: { type: 'connections', ids: ['connection-1'] },
    });

    expect(getToggleSelectionUpdate(state, 'nodes', 'node-1')).toEqual({
      selection: { type: 'nodes', ids: ['node-1'] },
      selectionPoint: null,
    });
  });

  it('clears the selection when the last ID is removed', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1'] },
    });

    expect(getToggleSelectionUpdate(state, 'nodes', 'node-1')).toEqual({
      selection: null,
      selectionPoint: null,
    });
  });

  it('does nothing when the canvas is not selectable', () => {
    const state = canvasState({ selectable: false });

    expect(getToggleSelectionUpdate(state, 'nodes', 'node-1')).toEqual({});
  });
});
