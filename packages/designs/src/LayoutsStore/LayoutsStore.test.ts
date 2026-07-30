import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultCardLayout } from '../default-layouts';
import {
  cleanup,
  design_books,
  design_pages,
  layout_card_1,
  setup,
} from '../test-utils';
import { getAllLayouts, getLayout } from './LayoutsStore';

describe('LayoutsStore', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('getLayout', () => {
    it('returns a layout from a design', () => {
      expect(getLayout(layout_card_1.id)).toEqual(layout_card_1);
    });

    it('falls back to the built-in default layouts', () => {
      expect(getLayout(DefaultCardLayout.id)).toEqual(DefaultCardLayout);
    });

    it('returns null if the layout does not exist', () => {
      expect(getLayout('non-existent-layout')).toBeNull();
    });
  });

  describe('getAllLayouts', () => {
    it('returns the layouts of all designs, excluding built-in defaults', () => {
      const layouts = getAllLayouts();

      // Contains layouts from multiple designs
      expect(layouts).toEqual(
        expect.arrayContaining([
          ...design_books.layouts,
          ...design_pages.layouts,
        ]),
      );

      // Does not contain built-in default layouts
      expect(
        layouts.find((layout) => layout.id === DefaultCardLayout.id),
      ).toBeUndefined();
    });
  });
});
