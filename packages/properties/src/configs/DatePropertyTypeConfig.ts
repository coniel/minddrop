import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const DatePropertyTypeConfig: PropertyTypeConfig = {
  type: 'date',
  icon: 'calendar',
  name: i18n.t('properties.date.name'),
  description: i18n.t('properties.date.description'),
};
