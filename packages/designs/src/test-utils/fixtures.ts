import { Design } from '../types';

export const design1: Design = {
  id: 'design-1',
  type: 'page',
  name: 'Design 1',
  elements: [
    {
      id: 'root',
      type: 'container',
      direction: 'row',
      style: {},
      children: [],
    },
  ],
};

export const design2: Design = {
  id: 'design-2',
  type: 'card',
  name: 'Design 2',
  elements: [
    {
      id: 'root',
      type: 'container',
      direction: 'row',
      style: {},
      children: [],
    },
  ],
};
