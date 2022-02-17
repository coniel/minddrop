import {
  colItemHtmlDrop1,
  colItemImageDrop1,
  colItemTextDrop1,
  colItemTextDrop2,
  colItemTextDrop3,
  colItemTextDrop4,
} from '../test-utils';
import { moveColumnItems } from './moveColumnItems';

const columns = {
  0: [colItemTextDrop1],
  1: [colItemTextDrop2, colItemImageDrop1],
  2: [colItemTextDrop3, colItemTextDrop4, colItemHtmlDrop1],
  3: [],
};

describe('moveColumnItems', () => {
  it('moves items between columns', () => {
    const result = moveColumnItems(
      columns,
      [colItemTextDrop1, colItemImageDrop1],
      2,
      1,
    );

    expect(result).toEqual({
      0: [],
      1: [colItemTextDrop2],
      2: [
        colItemTextDrop3,
        colItemTextDrop1,
        colItemImageDrop1,
        colItemTextDrop4,
        colItemHtmlDrop1,
      ],
      3: [],
    });
  });

  it('moves items upward within a column', () => {
    const result = moveColumnItems(columns, [colItemHtmlDrop1], 2, 1);

    expect(result).toEqual({
      0: [colItemTextDrop1],
      1: [colItemTextDrop2, colItemImageDrop1],
      2: [colItemTextDrop3, colItemHtmlDrop1, colItemTextDrop4],
      3: [],
    });
  });

  it('moves items to the start of a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop4], 2, 0);

    expect(result).toEqual({
      0: [colItemTextDrop1],
      1: [colItemTextDrop2, colItemImageDrop1],
      2: [colItemTextDrop4, colItemTextDrop3, colItemHtmlDrop1],
      3: [],
    });
  });

  it('moves items downward within a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop3], 2, 2);

    expect(result).toEqual({
      0: [colItemTextDrop1],
      1: [colItemTextDrop2, colItemImageDrop1],
      2: [colItemTextDrop4, colItemTextDrop3, colItemHtmlDrop1],
      3: [],
    });
  });

  it('moves items to the end of a column', () => {
    const result = moveColumnItems(columns, [colItemTextDrop3], 2, 3);

    expect(result).toEqual({
      0: [colItemTextDrop1],
      1: [colItemTextDrop2, colItemImageDrop1],
      2: [colItemTextDrop4, colItemHtmlDrop1, colItemTextDrop3],
      3: [],
    });
  });

  it('works with a combination of external and internal column items moving', () => {
    const result = moveColumnItems(
      columns,
      [colItemTextDrop1, colItemImageDrop1, colItemTextDrop4],
      2,
      3,
    );

    expect(result).toEqual({
      0: [],
      1: [colItemTextDrop2],
      2: [
        colItemTextDrop3,
        colItemHtmlDrop1,
        colItemTextDrop1,
        colItemImageDrop1,
        colItemTextDrop4,
      ],
      3: [],
    });
  });
});
