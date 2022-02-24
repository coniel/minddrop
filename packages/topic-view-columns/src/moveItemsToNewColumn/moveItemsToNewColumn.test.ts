import { setup, cleanup } from '../test-utils';
import { Columns } from '../types';
import { moveItemsToNewColumn } from './moveItemsToNewColumn';

const columns: Columns = [
  [
    { id: 'drop-1', type: 'drop' },
    { id: 'drop-2', type: 'drop' },
    { id: 'drop-3', type: 'drop' },
  ],
  [
    { id: 'drop-4', type: 'drop' },
    { id: 'drop-5', type: 'drop' },
    { id: 'drop-6', type: 'drop' },
  ],
  [
    { id: 'drop-7', type: 'drop' },
    { id: 'drop-8', type: 'drop' },
    { id: 'drop-9', type: 'drop' },
  ],
];

describe('moveItemsToNewColumn', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('moves items to new column', () => {
    expect(
      moveItemsToNewColumn(columns, ['drop-1', 'drop-7', 'drop-9'], 1),
    ).toEqual([
      [
        { id: 'drop-2', type: 'drop' },
        { id: 'drop-3', type: 'drop' },
      ],
      [
        { id: 'drop-1', type: 'drop' },
        { id: 'drop-7', type: 'drop' },
        { id: 'drop-9', type: 'drop' },
      ],
      [
        { id: 'drop-4', type: 'drop' },
        { id: 'drop-5', type: 'drop' },
        { id: 'drop-6', type: 'drop' },
      ],
      [{ id: 'drop-8', type: 'drop' }],
    ]);
  });

  it('removes excess emptied columns', () => {
    expect(
      moveItemsToNewColumn(columns, ['drop-4', 'drop-5', 'drop-6'], 3),
    ).toEqual([
      [
        { id: 'drop-1', type: 'drop' },
        { id: 'drop-2', type: 'drop' },
        { id: 'drop-3', type: 'drop' },
      ],
      // Emptied column removed
      [
        { id: 'drop-7', type: 'drop' },
        { id: 'drop-8', type: 'drop' },
        { id: 'drop-9', type: 'drop' },
      ],
      [
        { id: 'drop-4', type: 'drop' },
        { id: 'drop-5', type: 'drop' },
        { id: 'drop-6', type: 'drop' },
      ],
    ]);
  });
});
