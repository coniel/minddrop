import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface FormattedTextPropertySchema extends PropertySchemaBase {
  type: 'text-formatted';
  defaultValue?: string;
}

export const FormattedTextPropertySchema: FormattedTextPropertySchema = {
  type: 'text-formatted',
  icon: 'content-icon:text-quote:default',
  name: i18n.t('properties.markdown.name'),
  description: i18n.t('properties.markdown.description'),
};
