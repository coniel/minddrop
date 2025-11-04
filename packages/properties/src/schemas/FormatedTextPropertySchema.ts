import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface FormatedTextPropertySchema extends PropertySchemaBase {
  type: 'text-formated';
  defaultValue?: string;
}

export const FormatedTextPropertySchema: FormatedTextPropertySchema = {
  type: 'text-formated',
  icon: 'content-icon:text-quote:default',
  name: i18n.t('properties.markdown.name'),
  description: i18n.t('properties.markdown.description'),
};
