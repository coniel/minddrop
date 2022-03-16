import {
  colItemHtmlDrop1,
  colItemImageDrop1,
  colItemTextDrop1,
  colItemTextDrop2,
  colItemTextDrop3,
  colItemTextDrop4,
} from '../test-utils';
import { Columns } from '../types';
import { moveColumnItems } from './moveColumnItems';

const columns: Columns = [
  { id: 'column-0', items: [colItemTextDrop1] },
  { id: 'column-1', items: [colItemTextDrop2, colItemImageDrop1] },
  {
    id: 'column-2',
    items: [colItemTextDrop3, colItemTextDrop4, colItemHtmlDrop1],
  },
];

describe('moveColumnItems', () => {
  it('moves items between columns', () => {
    const result = moveColumnItems(
      columns,
      [colItemTextDrop2, colItemTextDrop4],
      0,
      0,
    );

    expect(result).toEqual([
      {
        id: 'column-0',
        items: [colItemTextDrop2, colItemTextDrop4, colItemTextDrop1],
      },
      { id: 'column-1', items: [colItemImageDrop1] },
      { id: 'column-2', items: [colItemTextDrop3, colItemHtmlDrop1] },
    ]);
  });

  it('moves items upward within a column', () => {
    const result = moveColumnItems(columns, [colItemHtmlDrop1], 2, 1);

    expect(result).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2, colItemImageDrop1] },
      {
        id: 'column-2',
        items: [colItemTextDrop3, colItemHtmlDrop1, colItemTextDrop4],
      },
    ]);
  });

  it('moves items to the start of a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop4], 2, 0);

    expect(result).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2, colItemImageDrop1] },
      {
        id: 'column-2',
        items: [colItemTextDrop4, colItemTextDrop3, colItemHtmlDrop1],
      },
    ]);
  });

  it('moves items downward within a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop3], 2, 2);

    expect(result).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2, colItemImageDrop1] },
      {
        id: 'column-2',
        items: [colItemTextDrop4, colItemTextDrop3, colItemHtmlDrop1],
      },
    ]);
  });

  it('moves items to the end of a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop3], 2, 3);

    expect(result).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2, colItemImageDrop1] },
      {
        id: 'column-2',
        items: [colItemTextDrop4, colItemHtmlDrop1, colItemTextDrop3],
      },
    ]);
  });

  it('works with a combination of external and internal column items moving', () => {
    const result = moveColumnItems(
      columns,
      [colItemImageDrop1, colItemTextDrop4],
      2,
      3,
    );

    expect(result).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2] },
      {
        id: 'column-2',
        items: [
          colItemTextDrop3,
          colItemHtmlDrop1,
          colItemImageDrop1,
          colItemTextDrop4,
        ],
      },
    ]);
  });

  it('removes excess empty columns', () => {
    const excessColumns: Columns = [
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2] },
      { id: 'column-2', items: [colItemTextDrop3] },
      { id: 'column-3', items: [colItemTextDrop4] },
    ];

    const result = moveColumnItems(excessColumns, [colItemTextDrop1], 1, 1);

    expect(result).toEqual([
      { id: 'column-1', items: [colItemTextDrop2, colItemTextDrop1] },
      { id: 'column-2', items: [colItemTextDrop3] },
      { id: 'column-3', items: [colItemTextDrop4] },
    ]);
  });
});
