import { Columns } from '../types';
import { removeEmptiedColumns } from './removeEmptiedColumns';

describe('removeEmptyColumns', () => {
  it('removes the emptied columns', () => {
    const original: Columns = [
      [{ id: 'drop-1', type: 'drop' }],
      [{ id: 'drop-2', type: 'drop' }],
      [],
      [{ id: 'drop-3', type: 'drop' }],
      [{ id: 'drop-4', type: 'drop' }],
      [],
    ];

    // Moved drop-1 and drop-4 to column 1
    const updated: Columns = [
      [],
      [
        { id: 'drop-2', type: 'drop' },
        { id: 'drop-1', type: 'drop' },
        { id: 'drop-4', type: 'drop' },
      ],
      [],
      [{ id: 'drop-3', type: 'drop' }],
      [],
      [],
    ];

    // Should remove emptied columns
    expect(removeEmptiedColumns(original, updated)).toEqual([
      // Removed column 0
      [
        { id: 'drop-2', type: 'drop' },
        { id: 'drop-1', type: 'drop' },
        { id: 'drop-4', type: 'drop' },
      ],
      [],
      [{ id: 'drop-3', type: 'drop' }],
      // Removed column 4
      [],
    ]);
  });

  it('supports added column in next columns state', () => {
    const original: Columns = [
      [{ id: 'drop-1', type: 'drop' }],
      [{ id: 'drop-2', type: 'drop' }],
      [{ id: 'drop-3', type: 'drop' }],
    ];

    // Move drop-2 to new column 3
    const updated: Columns = [
      [{ id: 'drop-1', type: 'drop' }],
      [],
      [{ id: 'drop-3', type: 'drop' }],
      [{ id: 'drop-2', type: 'drop' }],
    ];

    expect(removeEmptiedColumns(original, updated, 3)).toEqual([
      [{ id: 'drop-1', type: 'drop' }],
      // Removed column 1
      [{ id: 'drop-3', type: 'drop' }],
      [{ id: 'drop-2', type: 'drop' }],
    ]);
  });
});
