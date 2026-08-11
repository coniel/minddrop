import { describe, expect, it } from 'vitest';
import { createCanvasStore } from '../../createCanvasStore';
import { CanvasState } from '../../types';
import { getSelectedIds } from './getSelectedIds';

// Returns a canvas state with the given values applied
function canvasState(values: Partial<CanvasState>): CanvasState {
  return { ...createCanvasStore().useStore.getState(), ...values };
}

describe('getSelectedIds', () => {
  it('returns the IDs of a matching selection', () => {
    const state = canvasState({
      selection: { type: 'nodes', ids: ['node-1', 'node-2'] },
    });

    expect(getSelectedIds(state, 'nodes')).toEqual(['node-1', 'node-2']);
  });

  it('returns nothing for a selection of another type', () => {
    const state = canvasState({
      selection: { type: 'connections', ids: ['connection-1'] },
    });

    expect(getSelectedIds(state, 'nodes')).toEqual([]);
  });

  it('returns nothing when there is no selection', () => {
    expect(getSelectedIds(canvasState({ selection: null }), 'nodes')).toEqual(
      [],
    );
  });
});
