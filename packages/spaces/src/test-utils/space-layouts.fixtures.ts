import { DefaultContainerStyle, Layout } from '@minddrop/designs';

function generateSpaceLayoutFixture(number: number): Layout {
  return {
    id: `layout_space-${number}`,
    type: 'space',
    name: `Space layout ${number}`,
    tree: {
      id: 'root',
      type: 'root',
      layoutType: 'space',
      style: { ...DefaultContainerStyle },
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
