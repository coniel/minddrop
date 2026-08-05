import { describe, expect, it } from 'vitest';
import { DesignFixtures, Layout } from '@minddrop/designs';
import { pageLayout_1, viewPageLayout } from '../../test-utils';
import { setLayoutElementContent } from './setLayoutElementContent';

const { element_container_1 } = DesignFixtures;

const viewElement = viewPageLayout.tree.children[0];

// A page layout with the view element nested inside a container
const nestedLayout: Layout = {
  ...pageLayout_1,
  tree: {
    ...pageLayout_1.tree,
    children: [{ ...element_container_1, children: [viewElement] }],
  },
};

describe('setLayoutElementContent', () => {
  it('sets the content on the matched view element', () => {
    const updated = setLayoutElementContent(
      viewPageLayout,
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
      setLayoutElementContent(pageLayout_1, 'view-element-1', 'view_1'),
    ).toEqual(pageLayout_1);
  });
});
