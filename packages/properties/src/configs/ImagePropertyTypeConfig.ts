import { i18n } from '@minddrop/i18n';
import { PropertyTypeConfig } from '../types';

export const ImagePropertyTypeConfig: PropertyTypeConfig = {
  type: 'image',
  icon: 'image',
  name: i18n.t('properties.image.name'),
  description: i18n.t('properties.image.description'),
};
