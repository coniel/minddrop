import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const NumberPropertyTypeConfig: PropertyTypeConfig = {
  type: 'number',
  icon: 'hash',
  name: i18n.t('properties.number.name'),
  description: i18n.t('properties.number.description'),
};
