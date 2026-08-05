import {
  DefaultContainerElementStyle,
  DefaultViewElementStyle,
  Layout,
  ViewElement,
} from '@minddrop/designs';

function generateSpaceLayoutFixture(number: number): Layout {
  return {
    id: `layout_space-${number}`,
    type: 'page',
    name: `Space layout ${number}`,
    tree: {
      id: 'root',
      type: 'root',
      style: { ...DefaultContainerElementStyle },
      children: [],
    },
    frame: { x: 0, y: 0, width: 800, height: 600 },
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const spaceLayout_1 = generateSpaceLayoutFixture(1);
export const spaceLayout_2 = generateSpaceLayoutFixture(2);
export const spaceLayout_3 = generateSpaceLayoutFixture(3);

export const spaceLayouts = [spaceLayout_1, spaceLayout_2, spaceLayout_3];

// A static view element without a configured view
export const spaceViewElement: ViewElement = {
  id: 'view-element-1',
  type: 'view',
  viewType: 'table',
  static: true,
  style: { ...DefaultViewElementStyle },
};

// A space layout containing the static view element
export const viewSpaceLayout: Layout = {
  ...generateSpaceLayoutFixture(4),
  id: 'layout_space-view',
  tree: {
    id: 'root',
    type: 'root',
    style: { ...DefaultContainerElementStyle },
    children: [spaceViewElement],
  },
};
