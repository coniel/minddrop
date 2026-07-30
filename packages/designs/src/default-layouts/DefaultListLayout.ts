import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Layout } from '../types';

export const DefaultListLayout: Layout = {
  id: 'list',
  type: 'list',
  name: `${i18nRoot}.layouts.list.name`,
  tree: {
    id: 'root',
    type: 'root',
    style: {
      ...DefaultContainerElementStyle,
      borderRadiusTopLeft: 8,
      borderRadiusTopRight: 8,
      borderRadiusBottomRight: 8,
      borderRadiusBottomLeft: 8,
      minHeight: 48,
    },
    children: [],
  },
  frame: { x: 0, y: 0, width: 600 },
  created: new Date(),
  lastModified: new Date(),
};
