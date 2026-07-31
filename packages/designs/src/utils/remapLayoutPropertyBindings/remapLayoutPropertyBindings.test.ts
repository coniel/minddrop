import { describe, expect, it } from 'vitest';
import {
  element_container_1,
  element_text_1,
  element_text_2,
  layout_card_1,
} from '../../test-utils';
import { Layout } from '../../types';
import { remapLayoutPropertyBindings } from './remapLayoutPropertyBindings';

// A layout with a bound root, a bound child and a bound
// grandchild element
const boundLayout: Layout = {
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

describe('remapLayoutPropertyBindings', () => {
  it('rebinds elements bound to the property', () => {
    const [layout] = remapLayoutPropertyBindings(
      [boundLayout],
      'Title',
      'Heading',
    );

    expect(layout.tree.children[0].property).toBe('Heading');
  });

  it('rebinds nested elements bound to the property', () => {
    const [layout] = remapLayoutPropertyBindings(
      [boundLayout],
      'Subtitle',
      'Tagline',
    );

    const container = layout.tree.children[1];

    if (!('children' in container)) {
      throw new Error('expected a container element');
    }

    expect(container.children[0].property).toBe('Tagline');
  });

  it('rebinds the root element', () => {
    const [layout] = remapLayoutPropertyBindings([boundLayout], 'Cover', 'Art');

    expect(layout.tree.property).toBe('Art');
  });

  it('unbinds elements when the new property name is null', () => {
    const [layout] = remapLayoutPropertyBindings([boundLayout], 'Title', null);

    expect(layout.tree.children[0].property).toBeUndefined();
  });

  it('leaves bindings to other properties untouched', () => {
    const [layout] = remapLayoutPropertyBindings(
      [boundLayout],
      'Title',
      'Heading',
    );

    expect(layout.tree.property).toBe('Cover');
  });
});
