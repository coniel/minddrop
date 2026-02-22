import { i18nRoot } from '../constants';
import { Design } from '../types';

export const DefaultListDesign: Design = {
  id: 'list',
  type: 'list',
  name: `${i18nRoot}.list.name`,
  tree: {
    id: 'root',
    type: 'root',
    children: [],
  },
  created: new Date(),
  lastModified: new Date(),
};
