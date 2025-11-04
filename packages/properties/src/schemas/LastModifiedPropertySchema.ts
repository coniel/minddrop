import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface LastModifiedPropertySchema extends PropertySchemaBase {
  type: 'last-modified';
}

export const LastModifiedPropertySchema: LastModifiedPropertySchema = {
  type: 'last-modified',
  icon: 'content-icon:clock:default',
  name: i18n.t('properties.lastModified.name'),
  description: i18n.t('properties.lastModified.description'),
  meta: true,
};
