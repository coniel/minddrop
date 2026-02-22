import { i18nRoot } from '../constants';
import { Design } from '../types';

export const DefaultPageDesign: Design = {
  id: 'page',
  type: 'page',
  name: `${i18nRoot}.page.name`,
  tree: {
    id: 'root',
    type: 'root',
    children: [],
  },
  created: new Date(),
  lastModified: new Date(),
};
