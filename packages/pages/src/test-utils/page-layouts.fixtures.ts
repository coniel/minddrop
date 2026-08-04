import { DefaultContainerElementStyle, Layout } from '@minddrop/designs';

function generatePageLayoutFixture(number: number): Layout {
  return {
    id: `layout_page-${number}`,
    type: 'page',
    name: `Page layout ${number}`,
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

export const pageLayout_1 = generatePageLayoutFixture(1);
export const pageLayout_2 = generatePageLayoutFixture(2);
export const pageLayout_3 = generatePageLayoutFixture(3);

export const pageLayouts = [pageLayout_1, pageLayout_2, pageLayout_3];
