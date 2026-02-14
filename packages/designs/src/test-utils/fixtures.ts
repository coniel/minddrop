import { Design } from '../types';

export const cardDesign1: Design = {
  id: 'card-design-1',
  type: 'card',
  name: 'Card Design 1',
  tree: {
    id: 'root',
    type: 'card',
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'text',
        style: {},
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
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'text',
        style: {},
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
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'text',
        style: {},
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
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'text',
        style: {},
        value: 'page-design-1',
      },
    ],
  },
};
