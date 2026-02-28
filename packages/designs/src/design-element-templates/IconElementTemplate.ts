import { DefaultIconElementStyle } from '../styles';
import { IconElement } from '../types';

export type IconElementTemplate = Omit<IconElement, 'id'>;

export const IconElementTemplate: IconElementTemplate = {
  type: 'icon',
  icon: 'content-icon:cat:default',
  style: { ...DefaultIconElementStyle },
};
