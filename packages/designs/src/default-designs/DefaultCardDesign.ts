import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Design } from '../types';

export const DefaultCardDesign: Design = {
  id: 'card',
  type: 'card',
  name: `${i18nRoot}.card.name`,
  tree: {
    id: 'root',
    type: 'root',
    style: { ...DefaultContainerElementStyle, minHeight: 200 },
    children: [],
  },
  created: new Date(),
  lastModified: new Date(),
};
