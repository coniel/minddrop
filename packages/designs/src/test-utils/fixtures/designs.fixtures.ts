import { MockFileDescriptor } from '@minddrop/file-system';
import { DefaultContainerElementStyle } from '../../styles';
import { Design, DesignType } from '../../types';
import { getDesignFilePath } from '../../utils';
import {
  element_container_1,
  element_text_2,
} from './design-elements.fixtures';

export const designsRootPath = 'path/to/Designs';

function generateDesignFixture(type: DesignType, version: number): Design {
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
        // Set the ID of the design as the placeholder
        // so it can be targeted by UI tests.
        {
          ...element_text_2,
          placeholder: `${type}-${version}`,
        },
      ],
    },
  };
}

export const design_card_1 = generateDesignFixture('card', 1);
export const design_card_2 = generateDesignFixture('card', 2);
export const design_card_3 = generateDesignFixture('card', 3);
export const design_list_1 = generateDesignFixture('list', 1);
export const design_list_2 = generateDesignFixture('list', 2);
export const design_list_3 = generateDesignFixture('list', 3);
export const design_page_1 = generateDesignFixture('page', 1);
export const design_page_2 = generateDesignFixture('page', 2);
export const design_page_3 = generateDesignFixture('page', 3);

export const designs = [
  design_card_1,
  design_card_2,
  design_card_3,
  design_list_1,
  design_list_2,
  design_list_3,
  design_page_1,
  design_page_2,
  design_page_3,
];

export const designFiles: MockFileDescriptor[] = designs.map((design) => ({
  path: getDesignFilePath(design.id),
  textContent: JSON.stringify(design),
}));
