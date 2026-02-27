import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Design } from '../types';

export const DefaultListDesign: Design = {
  id: 'list',
  type: 'list',
  name: `${i18nRoot}.list.name`,
  tree: {
    id: 'root',
    type: 'root',
    style: { ...DefaultContainerElementStyle },
    children: [],
  },
  created: new Date(),
  lastModified: new Date(),
};
