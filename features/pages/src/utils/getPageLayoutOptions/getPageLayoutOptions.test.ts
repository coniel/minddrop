import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { getPageLayoutOptions } from './getPageLayoutOptions';

const { design_books, design_cards, design_pages, layout_page_1 } =
  DesignFixtures;

describe('getPageLayoutOptions', () => {
  it('pairs page layouts with their parent design', () => {
    expect(getPageLayoutOptions([design_books])).toEqual([
      { design: design_books, layout: layout_page_1 },
    ]);
  });

  it('ignores designs without page layouts', () => {
    expect(getPageLayoutOptions([design_cards])).toEqual([]);
  });

  it('collects page layouts across multiple designs', () => {
    const options = getPageLayoutOptions([design_books, design_pages]);

    expect(options.map((option) => option.layout)).toEqual([
      layout_page_1,
      ...design_pages.layouts,
    ]);
  });
});
