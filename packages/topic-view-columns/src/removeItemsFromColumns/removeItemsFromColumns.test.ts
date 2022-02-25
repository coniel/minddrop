import { setup, cleanup } from '../test-utils';
import { Columns } from '../types';
import { removeItemsFromColumns } from './removeItemsFromColumns';

const columns: Columns = [
  {
    id: 'column-0',
    items: [
      { id: 'drop-1', type: 'drop' },
      { id: 'drop-2', type: 'drop' },
      { id: 'drop-3', type: 'drop' },
    ],
  },
  {
    id: 'column-1',
    items: [
      { id: 'drop-4', type: 'drop' },
      { id: 'drop-5', type: 'drop' },
      { id: 'drop-6', type: 'drop' },
    ],
  },
  {
    id: 'column-2',
    items: [
      { id: 'drop-7', type: 'drop' },
      { id: 'drop-8', type: 'drop' },
      { id: 'drop-9', type: 'drop' },
    ],
  },
];

describe('removeItemsFromColumns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes items from columns', () => {
    expect(
      removeItemsFromColumns(columns, ['drop-2', 'drop-4', 'drop-5', 'drop-6']),
    ).toEqual([
      {
        id: 'column-0',
        items: [
          { id: 'drop-1', type: 'drop' },
          { id: 'drop-3', type: 'drop' },
        ],
      },
      { id: 'column-1', items: [] },
      {
        id: 'column-2',
        items: [
          { id: 'drop-7', type: 'drop' },
          { id: 'drop-8', type: 'drop' },
          { id: 'drop-9', type: 'drop' },
        ],
      },
    ]);
  });
});
