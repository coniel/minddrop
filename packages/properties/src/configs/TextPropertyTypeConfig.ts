import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const TextPropertyTypeConfig: PropertyTypeConfig = {
  type: 'text',
  icon: 'text',
  name: i18n.t('properties.text.name'),
  description: i18n.t('properties.text.description'),
};
