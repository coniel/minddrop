import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const UrlPropertyTypeConfig: PropertyTypeConfig = {
  type: 'url',
  icon: 'link',
  name: i18n.t('properties.url.name'),
  description: i18n.t('properties.url.description'),
};
