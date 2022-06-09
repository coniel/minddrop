import { DROPS_TEST_DATA } from '@minddrop/drops';
import { ResourceReferences } from '@minddrop/resources';
import { setup, cleanup } from '../test-utils';
import { Columns } from '../types';
import { distributeItemsBetweenColumns } from './distributeItemsBetweenColumns';

const { drop1, drop2, drop3, drop4, drop5, drop6 } = DROPS_TEST_DATA;

const items = [
  ResourceReferences.generate('drops:drop', drop1.id),
  ResourceReferences.generate('drops:drop', drop2.id),
  ResourceReferences.generate('drops:drop', drop3.id),
  ResourceReferences.generate('drops:drop', drop4.id),
  ResourceReferences.generate('drops:drop', drop5.id),
  ResourceReferences.generate('drops:drop', drop6.id),
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
      { id: 'column-1', items: [{ resource: 'drops:drop', id: 'first-drop' }] },
      {
        id: 'column-2',
        items: [
          { resource: 'drops:drop', id: 'second-drop' },
          { resource: 'drops:drop', id: 'third-drop' },
          { resource: 'drops:drop', id: 'fourth-drop' },
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
