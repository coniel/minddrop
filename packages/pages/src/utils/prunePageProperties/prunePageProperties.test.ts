import { describe, expect, it } from 'vitest';
import { DesignFixtures, Layout } from '@minddrop/designs';
import { prunePageProperties } from './prunePageProperties';

const { layout_page_1, element_text_1 } = DesignFixtures;

// A page layout containing a single element bound to the 'title' property
const layout: Layout = {
  ...layout_page_1,
  tree: {
    ...layout_page_1.tree,
    children: [{ ...element_text_1, property: 'title' }],
  },
};

describe('prunePageProperties', () => {
  it('keeps values for properties bound in the layout', () => {
    expect(prunePageProperties(layout, { title: 'Media' })).toEqual({
      title: 'Media',
    });
  });

  it('drops values for properties not bound in the layout', () => {
    expect(prunePageProperties(layout, { title: 'Media', rating: 5 })).toEqual({
      title: 'Media',
    });
  });
});
