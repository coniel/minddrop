import { setup, cleanup } from '../test-utils';
import { Columns } from '../types';
import { removeItemsFromColumns } from './removeItemsFromColumns';

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
          { id: 'drop-1', resource: 'drops:drop' },
          { id: 'drop-3', resource: 'drops:drop' },
        ],
      },
      { id: 'column-1', items: [] },
      {
        id: 'column-2',
        items: [
          { id: 'drop-7', resource: 'drops:drop' },
          { id: 'drop-8', resource: 'drops:drop' },
          { id: 'drop-9', resource: 'drops:drop' },
        ],
      },
    ]);
  });
});
