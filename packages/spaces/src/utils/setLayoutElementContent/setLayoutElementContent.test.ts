import { describe, expect, it } from 'vitest';
import { Layout } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { spaceLayout_1 } from '../../test-utils';
import { setLayoutElementContent } from './setLayoutElementContent';

const { element_container_1, element_data_view_1 } = DesignFixtures;

// A space layout holding the data view element at the top level
const dataViewLayout: Layout = {
  ...spaceLayout_1,
  tree: { ...spaceLayout_1.tree, children: [element_data_view_1] },
};

// A space layout with the data view element nested in a container
const nestedLayout: Layout = {
  ...spaceLayout_1,
  tree: {
    ...spaceLayout_1.tree,
    children: [{ ...element_container_1, children: [element_data_view_1] }],
  },
};

describe('setLayoutElementContent', () => {
  it('sets the content on the matched data view element', () => {
    const updated = setLayoutElementContent(
      dataViewLayout,
      element_data_view_1.id,
      'data-view_1',
    );

    expect(updated.tree.children[0]).toEqual({
      ...element_data_view_1,
      content: 'data-view_1',
    });
  });

  it('sets the content on nested data view elements', () => {
    const updated = setLayoutElementContent(
      nestedLayout,
      element_data_view_1.id,
      'data-view_1',
    );

    const container = updated.tree.children[0];

    expect('children' in container && container.children[0]).toEqual({
      ...element_data_view_1,
      content: 'data-view_1',
    });
  });

  it('leaves layouts without the element unchanged', () => {
    expect(
      setLayoutElementContent(
        spaceLayout_1,
        element_data_view_1.id,
        'data-view_1',
      ),
    ).toEqual(spaceLayout_1);
  });
});
