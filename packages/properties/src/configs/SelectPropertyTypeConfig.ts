import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const SelectPropertyTypeConfig: PropertyTypeConfig = {
  type: 'select',
  icon: 'chevron-down-circle',
  name: i18n.t('properties.select.name'),
  description: i18n.t('properties.select.description'),
};
