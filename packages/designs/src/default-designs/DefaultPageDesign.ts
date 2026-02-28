import { i18nRoot } from '../constants';
import { DefaultContainerElementStyle } from '../styles';
import { Design } from '../types';

export const DefaultPageDesign: Design = {
  id: 'page',
  type: 'page',
  name: `${i18nRoot}.page.name`,
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
  created: new Date(),
  lastModified: new Date(),
};
