import {
  setup,
  cleanup,
  colItemTextDrop1,
  colItemTextDrop2,
  colItemTextDrop3,
  colItemTextDrop4,
  colItemHtmlDrop1,
  colItemImageDrop1,
} from '../test-utils';
import { Columns } from '../types';
import { distributeItemsBetweenColumns } from './distributeItemsBetweenColumns';

const items = [
  colItemTextDrop1,
  colItemTextDrop2,
  colItemTextDrop3,
  colItemTextDrop4,
  colItemHtmlDrop1,
  colItemImageDrop1,
];

describe('distributeDropsBetweenColumns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('fills out empty columns evenly from the left', () => {
    const columns: Columns = [
      { id: 'column-0', items: [] },
      { id: 'column-1', items: [] },
      { id: 'column-2', items: [] },
      { id: 'column-3', items: [] },
    ];

    const result = distributeItemsBetweenColumns(columns, items);

    expect(result[0].items.length).toBe(2);
    expect(result[1].items.length).toBe(2);
    expect(result[2].items.length).toBe(1);
    expect(result[3].items.length).toBe(1);
  });

  it('fills out columns evenly from the left', () => {
    const columns: Columns = [
      { id: 'column-0', items: [] },
      { id: 'column-1', items: [{ type: 'drop', id: 'first-drop' }] },
      {
        id: 'column-2',
        items: [
          { type: 'drop', id: 'second-drop' },
          { type: 'drop', id: 'third-drop' },
          { type: 'drop', id: 'fourth-drop' },
        ],
      },
      { id: 'columns-3', items: [] },
    ];

    const result = distributeItemsBetweenColumns(columns, items);

    expect(result[0].items.length).toBe(3);
    expect(result[1].items.length).toBe(2);
    expect(result[2].items.length).toBe(3);
    expect(result[3].items.length).toBe(2);
  });
});
