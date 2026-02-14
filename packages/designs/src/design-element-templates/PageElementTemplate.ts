import { PageElement } from '../types';

export type PageElementTemplate = Omit<PageElement, 'id'>;

export const PageElementTemplate: PageElementTemplate = {
  type: 'page',
  style: {},
  children: [],
};
