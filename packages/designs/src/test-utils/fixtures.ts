import { Design } from '../types';

export const cardDesign1: Design = {
  id: 'card-design-1',
  type: 'card',
  name: 'Card Design 1',
  elements: {
    id: 'root',
    type: 'card',
    direction: 'column',
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'static-text',
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
  elements: {
    id: 'root',
    type: 'card',
    direction: 'column',
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'static-text',
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
  elements: {
    id: 'root',
    type: 'list',
    direction: 'row',
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'static-text',
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
  elements: {
    id: 'root',
    type: 'page',
    direction: 'column',
    style: {},
    children: [
      {
        id: 'child-1',
        type: 'static-text',
        style: {},
        value: 'page-design-1',
      },
    ],
  },
};
