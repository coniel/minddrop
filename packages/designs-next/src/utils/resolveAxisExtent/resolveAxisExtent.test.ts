import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { resolveAxisExtent } from './resolveAxisExtent';

const { titleDesignElement } = DesignElementFixtures;

describe('resolveAxisExtent', () => {
  it('reads the rows an element spans', () => {
    expect(resolveAxisExtent(titleDesignElement, 'rows')).toEqual({
      start: titleDesignElement.row,
      end: titleDesignElement.row + titleDesignElement.rowSpan,
    });
  });

  it('reads the columns an element spans', () => {
    expect(resolveAxisExtent(titleDesignElement, 'columns')).toEqual({
      start: titleDesignElement.column,
      end: titleDesignElement.column + titleDesignElement.columnSpan,
    });
  });
});
