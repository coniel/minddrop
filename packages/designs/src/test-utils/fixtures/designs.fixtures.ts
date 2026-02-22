import { MockFileDescriptor } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { DesignFileExtension } from '../../constants';
import { Design, DesignType } from '../../types';
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
    path: `${designsRootPath}/${type} ${version}.${DesignFileExtension}`,
    created: new Date(),
    lastModified: new Date(),
    tree: {
      id: 'root',
      type: 'root',
      children: [
        element_container_1,
        // Set the ID of the design as the text value
        // so it can be targeted by UI tests.
        {
          ...element_text_2,
          value: `${type}-${version}`,
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
  path: design.path,
  textContent: JSON.stringify(omitPath(design)),
}));
