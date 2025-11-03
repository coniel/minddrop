import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const IconPropertyTypeConfig: PropertyTypeConfig = {
  type: 'icon',
  icon: 'smile',
  name: i18n.t('properties.icon.name'),
  description: i18n.t('properties.icon.description'),
};
