import { describe, expect, it } from 'vitest';
import {
  element_container_1,
  element_editor_1,
  element_text_1,
  element_text_2,
  layout_card_1,
} from '../test-utils';
import { Layout } from '../types';
import { elementTitleBindingId } from '../utils';
import { getLayoutPropertyBindings } from './getLayoutPropertyBindings';

describe('getLayoutPropertyBindings', () => {
  it('returns an empty map for a layout with no bindings', () => {
    expect(getLayoutPropertyBindings(layout_card_1)).toEqual({});
  });

  it('collects root, child, and nested element bindings', () => {
    const layout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        property: 'Cover',
        children: [
          { ...element_text_1, property: 'Title' },
          {
            ...element_container_1,
            children: [{ ...element_text_2, property: 'Subtitle' }],
          },
        ],
      },
    };

    expect(getLayoutPropertyBindings(layout)).toEqual({
      [layout.tree.id]: 'Cover',
      [element_text_1.id]: 'Title',
      [element_text_2.id]: 'Subtitle',
    });
  });

  it('collects editor element title bindings', () => {
    const layout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [
          { ...element_editor_1, property: 'Content', titleProperty: 'Title' },
        ],
      },
    };

    expect(getLayoutPropertyBindings(layout)).toEqual({
      [element_editor_1.id]: 'Content',
      [elementTitleBindingId(element_editor_1.id)]: 'Title',
    });
  });

  it('omits the title binding for editor elements without one', () => {
    const layout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [{ ...element_editor_1, property: 'Content' }],
      },
    };

    expect(getLayoutPropertyBindings(layout)).toEqual({
      [element_editor_1.id]: 'Content',
    });
  });
});
