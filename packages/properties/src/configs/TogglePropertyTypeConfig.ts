import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const TogglePropertyTypeConfig: PropertyTypeConfig = {
  type: 'toggle',
  icon: 'check-square',
  name: i18n.t('properties.toggle.name'),
  description: i18n.t('properties.toggle.description'),
};
