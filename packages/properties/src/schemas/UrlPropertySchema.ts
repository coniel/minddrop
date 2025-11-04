import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface UrlPropertySchema extends PropertySchemaBase {
  type: 'url';
  defaultValue?: string;
}

export const UrlPropertySchema: UrlPropertySchema = {
  type: 'url',
  icon: 'content-icon:link:default',
  name: i18n.t('properties.url.name'),
  description: i18n.t('properties.url.description'),
};
