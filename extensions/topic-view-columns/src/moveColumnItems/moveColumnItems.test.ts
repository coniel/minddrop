import { DROPS_TEST_DATA } from '@minddrop/drops';
import { ResourceReferences } from '@minddrop/resources';
import { Columns } from '../types';
import { moveColumnItems } from './moveColumnItems';

const { drop1, drop2, drop3, drop4, drop5, drop6 } = DROPS_TEST_DATA;

const drop1Reference = ResourceReferences.generate('drops:drop', drop1.id);
const drop2Reference = ResourceReferences.generate('drops:drop', drop2.id);
const drop3Reference = ResourceReferences.generate('drops:drop', drop3.id);
const drop4Reference = ResourceReferences.generate('drops:drop', drop4.id);
const drop5Reference = ResourceReferences.generate('drops:drop', drop5.id);
const drop6Reference = ResourceReferences.generate('drops:drop', drop6.id);

const columns: Columns = [
  { id: 'column-0', items: [drop1Reference] },
  { id: 'column-1', items: [drop2Reference, drop6Reference] },
  {
    id: 'column-2',
    items: [drop3Reference, drop4Reference, drop5Reference],
  },
];

describe('moveColumnItems', () => {
  it('moves items between columns', () => {
    const result = moveColumnItems(
      columns,
      [drop2Reference, drop4Reference],
      0,
      0,
    );

    expect(result).toEqual([
      {
        id: 'column-0',
        items: [drop2Reference, drop4Reference, drop1Reference],
      },
      { id: 'column-1', items: [drop6Reference] },
      { id: 'column-2', items: [drop3Reference, drop5Reference] },
    ]);
  });

  it('moves items upward within a column', () => {
    const result = moveColumnItems(columns, [drop5Reference], 2, 1);

    expect(result).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference, drop6Reference] },
      {
        id: 'column-2',
        items: [drop3Reference, drop5Reference, drop4Reference],
      },
    ]);
  });

  it('moves items to the start of a column', () => {
    const result = moveColumnItems(columns, [drop4Reference], 2, 0);

    expect(result).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference, drop6Reference] },
      {
        id: 'column-2',
        items: [drop4Reference, drop3Reference, drop5Reference],
      },
    ]);
  });

  it('moves items downward within a column', () => {
    const result = moveColumnItems(columns, [drop3Reference], 2, 2);

    expect(result).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference, drop6Reference] },
      {
        id: 'column-2',
        items: [drop4Reference, drop3Reference, drop5Reference],
      },
    ]);
  });

  it('moves items to the end of a column', () => {
    const result = moveColumnItems(columns, [drop3Reference], 2, 3);

    expect(result).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference, drop6Reference] },
      {
        id: 'column-2',
        items: [drop4Reference, drop5Reference, drop3Reference],
      },
    ]);
  });

  it('works with a combination of external and internal column items moving', () => {
    const result = moveColumnItems(
      columns,
      [drop6Reference, drop4Reference],
      2,
      3,
    );

    expect(result).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference] },
      {
        id: 'column-2',
        items: [drop3Reference, drop5Reference, drop6Reference, drop4Reference],
      },
    ]);
  });
});
