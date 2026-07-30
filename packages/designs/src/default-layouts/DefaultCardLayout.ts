import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Layout } from '../types';

export const DefaultCardLayout: Layout = {
  id: 'card',
  type: 'card',
  name: `${i18nRoot}.layouts.card.name`,
  tree: {
    id: 'root',
    type: 'root',
    style: {
      ...DefaultContainerElementStyle,
      borderRadiusTopLeft: 8,
      borderRadiusTopRight: 8,
      borderRadiusBottomRight: 8,
      borderRadiusBottomLeft: 8,
      minHeight: 200,
    },
    children: [],
  },
  frame: { x: 0, y: 0, width: 380 },
  created: new Date(),
  lastModified: new Date(),
};
