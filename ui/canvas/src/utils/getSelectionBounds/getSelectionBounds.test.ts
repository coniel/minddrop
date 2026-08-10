import { describe, expect, it } from 'vitest';
import { getSelectionBounds } from './getSelectionBounds';

const nodes = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 300, y: 50, width: 100, height: 100 },
};

describe('getSelectionBounds', () => {
  it('returns null when no ID resolves', () => {
    expect(getSelectionBounds(['missing'], nodes)).toBeNull();
  });

  it('returns null when given no IDs', () => {
    expect(getSelectionBounds([], nodes)).toBeNull();
  });

  it('encloses the selected nodes', () => {
    expect(getSelectionBounds(['node-1', 'node-2'], nodes)).toEqual({
      x: 0,
      y: 0,
      width: 400,
      height: 150,
    });
  });

  it('skips IDs with no registered frame', () => {
    // A selected node that has since unmounted must not break
    // the bounds of the ones that remain
    expect(getSelectionBounds(['node-1', 'unmounted'], nodes)).toEqual(
      nodes['node-1'],
    );
  });
});
