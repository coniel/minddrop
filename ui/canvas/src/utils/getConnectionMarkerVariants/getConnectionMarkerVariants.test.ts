import { describe, expect, it } from 'vitest';
import { CanvasConnection } from '../../types';
import { getConnectionMarkerVariants } from './getConnectionMarkerVariants';

const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

describe('getConnectionMarkerVariants', () => {
  it('always includes the preview curve variant', () => {
    expect(getConnectionMarkerVariants([])).toEqual([
      { color: 'default', thickness: 'medium' },
    ]);
  });

  it('styles the preview variant from the preview style', () => {
    expect(
      getConnectionMarkerVariants([], {
        previewStyle: { color: 'red' },
        connectionDefaults: { color: 'blue', thickness: 'thin' },
      }),
    ).toEqual([{ color: 'red', thickness: 'thin' }]);
  });

  it('includes a variant per connection combination', () => {
    const variants = getConnectionMarkerVariants([
      { ...connection, color: 'red' },
      { ...connection, id: 'connection-2', color: 'blue', thickness: 'thick' },
    ]);

    expect(variants).toEqual([
      { color: 'default', thickness: 'medium' },
      { color: 'red', thickness: 'medium' },
      { color: 'blue', thickness: 'thick' },
    ]);
  });

  it('drops duplicate combinations', () => {
    const variants = getConnectionMarkerVariants([
      { ...connection, color: 'red' },
      { ...connection, id: 'connection-2', color: 'red' },
    ]);

    expect(variants).toHaveLength(2);
  });

  it('sizes the drop target variant for a thick curve', () => {
    const variants = getConnectionMarkerVariants([{ ...connection }], {
      dropTargetConnectionId: 'connection-1',
    });

    expect(variants).toEqual([
      { color: 'default', thickness: 'medium' },
      { color: 'default', thickness: 'thick' },
    ]);
  });
});
