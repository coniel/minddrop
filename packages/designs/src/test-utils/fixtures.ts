import { ContainerElement, Design, TextElement } from '../types';

export const textElement1: TextElement = {
  id: 'text-element-1',
  type: 'text',
  value: 'Text Element 1',
  style: {
    'font-family': 'sans',
  },
};

export const containerElement1: ContainerElement = {
  id: 'container-element-1',
  type: 'container',
  children: [textElement1],
};

export const cardDesign1: Design = {
  id: 'card-design-1',
  type: 'card',
  name: 'Card Design 1',
  tree: {
    id: 'root',
    type: 'card',
    children: [
      {
        id: 'child-1',
        type: 'text',
        value: 'card-design-1',
      },
    ],
  },
};

export const cardDesign2: Design = {
  id: 'card-design-2',
  type: 'card',
  name: 'Card Design 2',
  tree: {
    id: 'root',
    type: 'card',
    children: [
      {
        id: 'child-1',
        type: 'text',
        value: 'card-design-2',
      },
    ],
  },
};

export const listDesign1: Design = {
  id: 'list-design-1',
  type: 'list',
  name: 'List Design 1',
  tree: {
    id: 'root',
    type: 'list',
    children: [
      {
        id: 'child-1',
        type: 'text',
        value: 'list-design-1',
      },
    ],
  },
};

export const pageDesign1: Design = {
  id: 'page-design-1',
  type: 'page',
  name: 'Page Design 1',
  tree: {
    id: 'root',
    type: 'page',
    children: [
      {
        id: 'child-1',
        type: 'text',
        value: 'page-design-1',
      },
    ],
  },
};
