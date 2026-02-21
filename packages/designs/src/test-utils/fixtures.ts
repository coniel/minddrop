import { ContainerElement, Design, TextElement } from '../types';

export const textElement_1: TextElement = {
  id: 'text-element-1',
  type: 'text',
  value: 'Text Element 1',
  style: {
    'font-family': 'sans',
  },
};

export const textElement_2: TextElement = {
  id: 'text-element-2',
  type: 'text',
  value: 'Text Element 2',
  style: {
    'font-family': 'sans',
  },
};

export const containerElement_1: ContainerElement = {
  id: 'container-element-1',
  type: 'container',
  children: [textElement_1],
};

export const design_1: Design = {
  id: 'design-1',
  name: 'Design 1',
  rootElement: {
    id: 'root',
    type: 'root',
    children: [containerElement_1, textElement_2],
  },
};

export const design_2: Design = {
  id: 'design-2',
  name: 'Design 2',
  rootElement: {
    id: 'root',
    type: 'root',
    children: [containerElement_1, textElement_2],
  },
};
