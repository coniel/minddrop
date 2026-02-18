import { PageDesign } from '../types';

export type PageDesignTemplate = Omit<PageDesign, 'id' | 'name'>;

export const PageDesignTemplate: PageDesignTemplate = {
  type: 'page',
  tree: {
    id: 'root',
    type: 'page',
    children: [],
  },
};
