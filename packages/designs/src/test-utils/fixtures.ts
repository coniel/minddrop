import { MockFileDescriptor } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { DesignFileExtension } from '../constants';
import { ContainerElement, Design, TextElement } from '../types';

export const designsRootPath = 'path/to/Designs';

export const element_text_1: TextElement = {
  id: 'text-element-1',
  type: 'text',
  value: 'Text Element 1',
  style: {
    'font-family': 'sans',
  },
};

export const element_text_2: TextElement = {
  id: 'text-element-2',
  type: 'text',
  value: 'Text Element 2',
  style: {
    'font-family': 'sans',
  },
};

export const element_container_1: ContainerElement = {
  id: 'container-element-1',
  type: 'container',
  children: [element_text_1],
};

export const design_card_1: Design = {
  id: 'card-1',
  name: 'Card 1',
  type: 'card',
  path: `${designsRootPath}/Card 1.${DesignFileExtension}`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  tree: {
    id: 'root',
    type: 'root',
    children: [
      element_container_1,
      // Set the text value to the design ID so it can be targeted by tests
      {
        ...element_text_2,
        value: 'card-1',
      },
    ],
  },
};

export const design_list_1: Design = {
  id: 'list-1',
  name: 'List 1',
  type: 'list',
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  path: `${designsRootPath}/List 1.${DesignFileExtension}`,
  tree: {
    id: 'root',
    type: 'root',
    children: [
      element_container_1,
      // Set the text value to the design ID so it can be targeted by tests
      {
        ...element_text_2,
        value: 'list-1',
      },
    ],
  },
};

export const designs = [design_card_1, design_list_1];

export const designFiles: MockFileDescriptor[] = designs.map((design) => ({
  path: design.path,
  textContent: JSON.stringify(omitPath(design)),
}));
