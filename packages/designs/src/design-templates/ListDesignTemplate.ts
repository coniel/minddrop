import { ListDesign } from '../types';

export type ListDesignTemplate = Omit<ListDesign, 'id' | 'name'>;

export const ListDesignTemplate: ListDesignTemplate = {
  type: 'list',
  tree: {
    id: 'root',
    type: 'list',
    children: [],
  },
};
