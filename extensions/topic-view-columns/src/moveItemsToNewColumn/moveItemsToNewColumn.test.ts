import { setup, cleanup } from '../test-utils';
import { Columns } from '../types';
import { moveItemsToNewColumn } from './moveItemsToNewColumn';

const columns: Columns = [
  {
    id: 'column-0',
    items: [
      { id: 'drop-1', resource: 'drops:drop' },
      { id: 'drop-2', resource: 'drops:drop' },
      { id: 'drop-3', resource: 'drops:drop' },
    ],
  },
  {
    id: 'column-1',
    items: [
      { id: 'drop-4', resource: 'drops:drop' },
      { id: 'drop-5', resource: 'drops:drop' },
      { id: 'drop-6', resource: 'drops:drop' },
    ],
  },
  {
    id: 'column-2',
    items: [
      { id: 'drop-7', resource: 'drops:drop' },
      { id: 'drop-8', resource: 'drops:drop' },
      { id: 'drop-9', resource: 'drops:drop' },
    ],
  },
];

describe('moveItemsToNewColumn', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('moves items to new column', () => {
    const result = moveItemsToNewColumn(
      columns,
      ['drop-1', 'drop-7', 'drop-9'],
      1,
    );

    // Creates a new column
    expect(result.length).toBe(columns.length + 1);
    // Removes items from original columns
    expect(result[0].items).toEqual([
      { id: 'drop-2', resource: 'drops:drop' },
      { id: 'drop-3', resource: 'drops:drop' },
    ]);
    expect(result[3].items).toEqual([{ id: 'drop-8', resource: 'drops:drop' }]);
    // Adds items to new column
    expect(result[1].items).toEqual([
      { id: 'drop-1', resource: 'drops:drop' },
      { id: 'drop-7', resource: 'drops:drop' },
      { id: 'drop-9', resource: 'drops:drop' },
    ]);
  });

  it('removes excess emptied columns', () => {
    const result = moveItemsToNewColumn(
      columns,
      ['drop-4', 'drop-5', 'drop-6'],
      3,
    );

    // Should have same amount of columns as before (1 added, 1 removed)
    expect(result.length).toBe(columns.length);
    // Should have moved items to last column
    expect(result[1].items).toEqual([
      { id: 'drop-7', resource: 'drops:drop' },
      { id: 'drop-8', resource: 'drops:drop' },
      { id: 'drop-9', resource: 'drops:drop' },
    ]);
    expect(result[2].items).toEqual([
      { id: 'drop-4', resource: 'drops:drop' },
      { id: 'drop-5', resource: 'drops:drop' },
      { id: 'drop-6', resource: 'drops:drop' },
    ]);
  });
});
