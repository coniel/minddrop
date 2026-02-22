import { i18nRoot } from '../constants';
import { Design } from '../types';

export const DefaultCardDesign: Design = {
  id: 'card',
  type: 'card',
  name: `${i18nRoot}.card.name`,
  tree: {
    id: 'root',
    type: 'root',
    children: [],
  },
  created: new Date(),
  lastModified: new Date(),
};
