import { DefaultContainerElementStyle } from '../../styles';
import { Layout, LayoutType } from '../../types';
import {
  element_container_1,
  element_text_2,
} from './design-elements.fixtures';

function generateLayoutFixture(type: LayoutType, version: number): Layout {
  return {
    type,
    id: `${type}-${version}`,
    name: `${type} ${version}`,
    created: new Date(),
    lastModified: new Date(),
    tree: {
      id: 'root',
      type: 'root',
      style: { ...DefaultContainerElementStyle },
      children: [
        element_container_1,
        // Set the ID of the layout as the placeholder
        // so it can be targeted by UI tests.
        {
          ...element_text_2,
          placeholder: `${type}-${version}`,
        },
      ],
    },
    // Pages have a fixed height; cards and lists are content sized
    frame:
      type === 'page'
        ? { x: 0, y: 0, width: 800, height: 600 }
        : { x: 0, y: 0, width: 380 },
  };
}

export const layout_card_1 = generateLayoutFixture('card', 1);
export const layout_card_2 = generateLayoutFixture('card', 2);
export const layout_card_3 = generateLayoutFixture('card', 3);
export const layout_list_1 = generateLayoutFixture('list', 1);
export const layout_list_2 = generateLayoutFixture('list', 2);
export const layout_list_3 = generateLayoutFixture('list', 3);
export const layout_page_1 = generateLayoutFixture('page', 1);
export const layout_page_2 = generateLayoutFixture('page', 2);
export const layout_page_3 = generateLayoutFixture('page', 3);

export const layouts = [
  layout_card_1,
  layout_card_2,
  layout_card_3,
  layout_list_1,
  layout_list_2,
  layout_list_3,
  layout_page_1,
  layout_page_2,
  layout_page_3,
];
