import { describe, expect, it } from 'vitest';
import { DesignFixtures, Layout } from '@minddrop/designs';
import { spaceLayout_1, viewSpaceLayout } from '../../test-utils';
import { setLayoutElementContent } from './setLayoutElementContent';

const { element_container_1 } = DesignFixtures;

const viewElement = viewSpaceLayout.tree.children[0];

// A space layout with the view element nested inside a container
const nestedLayout: Layout = {
  ...spaceLayout_1,
  tree: {
    ...spaceLayout_1.tree,
    children: [{ ...element_container_1, children: [viewElement] }],
  },
};

describe('setLayoutElementContent', () => {
  it('sets the content on the matched view element', () => {
    const updated = setLayoutElementContent(
      viewSpaceLayout,
      'view-element-1',
      'view_1',
    );

    expect(updated.tree.children[0]).toEqual({
      ...viewElement,
      content: 'view_1',
    });
  });

  it('sets the content on nested view elements', () => {
    const updated = setLayoutElementContent(
      nestedLayout,
      'view-element-1',
      'view_1',
    );

    const container = updated.tree.children[0];

    expect('children' in container && container.children[0]).toEqual({
      ...viewElement,
      content: 'view_1',
    });
  });

  it('leaves layouts without the element unchanged', () => {
    expect(
      setLayoutElementContent(spaceLayout_1, 'view-element-1', 'view_1'),
    ).toEqual(spaceLayout_1);
  });
});
