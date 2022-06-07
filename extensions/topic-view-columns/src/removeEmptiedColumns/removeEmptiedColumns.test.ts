import { Columns } from '../types';
import { removeEmptiedColumns } from './removeEmptiedColumns';

describe('removeEmptyColumns', () => {
  it('removes the emptied columns', () => {
    const original: Columns = [
      { id: 'column-0', items: [{ id: 'drop-1', resource: 'drops:drop' }] },
      { id: 'column-1', items: [{ id: 'drop-2', resource: 'drops:drop' }] },
      { id: 'column-2', items: [] },
      { id: 'column-3', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
      { id: 'column-4', items: [{ id: 'drop-4', resource: 'drops:drop' }] },
      { id: 'column-5', items: [] },
    ];

    // Empty column-0 and column-4
    const updated: Columns = [
      { id: 'column-0', items: [] },
      {
        id: 'column-1',
        items: [
          { id: 'drop-2', resource: 'drops:drop' },
          { id: 'drop-1', resource: 'drops:drop' },
          { id: 'drop-4', resource: 'drops:drop' },
        ],
      },
      { id: 'column-2', items: [] },
      { id: 'column-3', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
      { id: 'column-4', items: [] },
      { id: 'column-5', items: [] },
    ];

    // Should remove emptied columns
    expect(removeEmptiedColumns(original, updated)).toEqual([
      // Removed column 0
      {
        id: 'column-1',
        items: [
          { id: 'drop-2', resource: 'drops:drop' },
          { id: 'drop-1', resource: 'drops:drop' },
          { id: 'drop-4', resource: 'drops:drop' },
        ],
      },
      { id: 'column-2', items: [] },
      { id: 'column-3', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
      // Removed column 4
      { id: 'column-5', items: [] },
    ]);
  });

  it('supports added column in next columns state', () => {
    const original: Columns = [
      { id: 'column-0', items: [{ id: 'drop-1', resource: 'drops:drop' }] },
      { id: 'column-1', items: [{ id: 'drop-2', resource: 'drops:drop' }] },
      { id: 'column-2', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
    ];

    // Move drop-2 to new column 3
    const updated: Columns = [
      { id: 'column-0', items: [{ id: 'drop-1', resource: 'drops:drop' }] },
      { id: 'column-1', items: [] },
      { id: 'column-2', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
      { id: 'column-3', items: [{ id: 'drop-2', resource: 'drops:drop' }] },
    ];

    expect(removeEmptiedColumns(original, updated)).toEqual([
      { id: 'column-0', items: [{ id: 'drop-1', resource: 'drops:drop' }] },
      // Removed column 1
      { id: 'column-2', items: [{ id: 'drop-3', resource: 'drops:drop' }] },
      { id: 'column-3', items: [{ id: 'drop-2', resource: 'drops:drop' }] },
    ]);
  });
});
