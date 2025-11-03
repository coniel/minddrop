import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const CreatedPropertyTypeConfig: PropertyTypeConfig = {
  type: 'created',
  icon: 'clock',
  name: i18n.t('properties.created.name'),
  description: i18n.t('properties.created.description'),
  meta: true,
};
