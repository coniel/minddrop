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
    const columns = {
      0: [],
      1: [],
      2: [],
      3: [],
    };

    const result = distributeItemsBetweenColumns(columns, items);

    expect(result[0].length).toBe(2);
    expect(result[1].length).toBe(2);
    expect(result[2].length).toBe(1);
    expect(result[3].length).toBe(1);
  });

  it('fills out columns evenly from the left', () => {
    const columns = {
      0: [],
      1: [{ type: 'drop', id: 'first-drop' }],
      2: [
        { type: 'drop', id: 'second-drop' },
        { type: 'drop', id: 'third-drop' },
        { type: 'drop', id: 'fourth-drop' },
      ],
      3: [],
    };

    const result = distributeItemsBetweenColumns(columns, items);

    expect(result[0].length).toBe(3);
    expect(result[1].length).toBe(2);
    expect(result[2].length).toBe(3);
    expect(result[3].length).toBe(2);
  });
});
