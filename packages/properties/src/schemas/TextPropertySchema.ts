import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface TextPropertySchema extends PropertySchemaBase {
  type: 'text';
  defaultValue?: string;
}

export const TextPropertySchema: TextPropertySchema = {
  type: 'text',
  icon: 'content-icon:text:default',
  name: i18n.t('properties.text.name'),
  description: i18n.t('properties.text.description'),
};
