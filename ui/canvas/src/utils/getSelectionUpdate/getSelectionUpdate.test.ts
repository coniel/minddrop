import { describe, expect, it } from 'vitest';
import { createCanvasStore } from '../../createCanvasStore';
import { CanvasState } from '../../types';
import { getSelectionUpdate } from './getSelectionUpdate';

// Returns a canvas state with the given values applied
function canvasState(values: Partial<CanvasState>): CanvasState {
  return { ...createCanvasStore().useStore.getState(), ...values };
}

describe('getSelectionUpdate', () => {
  it('selects the given IDs', () => {
    const state = canvasState({ selection: null });

    expect(getSelectionUpdate(state, 'nodes', ['node-1'])).toEqual({
      selection: { type: 'nodes', ids: ['node-1'] },
      selectionPoint: null,
    });
  });

  it('replaces a selection of another type', () => {
    const state = canvasState({
      selection: { type: 'connections', ids: ['connection-1'] },
    });

    expect(getSelectionUpdate(state, 'nodes', ['node-1'], true)).toEqual({
      selection: { type: 'nodes', ids: ['node-1'] },
      selectionPoint: null,
    });
  });

  it('merges into a matching selection when additive', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1'] },
    });

    expect(
      getSelectionUpdate(state, 'nodes', ['node-1', 'node-2'], true),
    ).toEqual({
      selection: { type: 'nodes', ids: ['node-1', 'node-2'] },
      selectionPoint: null,
    });
  });

  it('clears the selection when selecting nothing', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1'] },
    });

    expect(getSelectionUpdate(state, 'nodes', [])).toEqual({
      selection: null,
      selectionPoint: null,
    });
  });

  it('skips selecting nothing when nothing is selected', () => {
    expect(
      getSelectionUpdate(canvasState({ selection: null }), 'nodes', []),
    ).toEqual({});
  });

  it('skips updates which do not change the selection', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1', 'node-2'] },
    });

    expect(getSelectionUpdate(state, 'nodes', ['node-2', 'node-1'])).toEqual(
      {},
    );
  });

  it('does nothing when the canvas is not selectable', () => {
    const state = canvasState({ selectable: false });

    expect(getSelectionUpdate(state, 'nodes', ['node-1'])).toEqual({});
  });
});
