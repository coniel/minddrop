import { ContainerElement, Design, TextElement } from '../types';

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
  rootElement: {
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
  name: 'List Design 1',
  type: 'list',
  rootElement: {
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
