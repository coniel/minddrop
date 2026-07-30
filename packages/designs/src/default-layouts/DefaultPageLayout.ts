import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Layout } from '../types';

export const DefaultPageLayout: Layout = {
  id: 'page',
  type: 'page',
  name: `${i18nRoot}.layouts.page.name`,
  tree: {
    id: 'root',
    type: 'root',
    style: {
      ...DefaultContainerElementStyle,
      borderRadiusTopLeft: 8,
      borderRadiusTopRight: 8,
      borderRadiusBottomRight: 8,
      borderRadiusBottomLeft: 8,
    },
    children: [],
  },
  frame: { x: 0, y: 0, width: 800, height: 600 },
  created: new Date(),
  lastModified: new Date(),
};
