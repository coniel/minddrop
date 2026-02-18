import { CardDesign } from '../types';

export type CardDesignTemplate = Omit<CardDesign, 'id' | 'name'>;

export const CardDesignTemplate: CardDesignTemplate = {
  type: 'card',
  tree: {
    id: 'root',
    type: 'card',
    children: [],
  },
};
