import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const LastModifiedPropertyTypeConfig: PropertyTypeConfig = {
  type: 'last-modified',
  icon: 'clock',
  name: i18n.t('properties.lastModified.name'),
  description: i18n.t('properties.lastModified.description'),
  meta: true,
};
