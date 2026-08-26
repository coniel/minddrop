import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FormattedTextPropertyElement,
  TextElement,
} from '../design-element-configs';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { Layout } from '../types';
import { elementTitleBindingId } from '../utils';
import { getLayoutPropertyBindings } from './getLayoutPropertyBindings';

const { layout_card_1, element_text_1, element_property_formatted_text_1 } =
  DesignFixtures;

describe('getLayoutPropertyBindings', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('collects element property bindings from the whole tree', () => {
    // Bind a property on a nested element
    const boundElement: TextElement = {
      ...element_text_1,
      id: 'bound-element',
      property: 'Title',
    };
    const layout: Layout = {
      ...layout_card_1,
      tree: {
        ...layout_card_1.tree,
        children: [
          {
            id: 'wrapper',
            type: 'container',
            style: {},
            children: [boundElement],
          },
        ],
      },
    };

    expect(getLayoutPropertyBindings(layout)).toEqual({
      'bound-element': 'Title',
    });
  });

  it('collects editor title bindings under the title binding ID', () => {
    const editor: FormattedTextPropertyElement = {
      ...element_property_formatted_text_1,
      property: 'Body',
      titleProperty: 'Title',
    };
    const layout: Layout = {
      ...layout_card_1,
      tree: { ...layout_card_1.tree, children: [editor] },
    };

    expect(getLayoutPropertyBindings(layout)).toEqual({
      [editor.id]: 'Body',
      [elementTitleBindingId(editor.id)]: 'Title',
    });
  });

  it('returns an empty map for layouts without bindings', () => {
    expect(getLayoutPropertyBindings(layout_card_1)).toEqual({});
  });
});
