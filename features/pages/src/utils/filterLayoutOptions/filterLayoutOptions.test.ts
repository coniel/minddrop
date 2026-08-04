import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { getPageLayoutOptions } from '../getPageLayoutOptions';
import { filterLayoutOptions } from './filterLayoutOptions';

const { design_books, design_pages, layout_page_2 } = DesignFixtures;

const options = getPageLayoutOptions([design_books, design_pages]);

describe('filterLayoutOptions', () => {
  it('returns all options when the query is empty', () => {
    expect(filterLayoutOptions(options, '  ')).toEqual(options);
  });

  it('matches layout names case-insensitively', () => {
    expect(
      filterLayoutOptions(options, layout_page_2.name.toUpperCase()),
    ).toEqual([{ design: design_pages, layout: layout_page_2 }]);
  });

  it('returns no options when nothing matches', () => {
    expect(filterLayoutOptions(options, 'no-such-layout')).toEqual([]);
  });
});
