import { i18n } from '@minddrop/i18n';
import { PropertySchemaBase } from '../types';

export interface NumberPropertySchema extends PropertySchemaBase {
  type: 'number';
  defaultValue?: number;
}

export const NumberPropertySchema: NumberPropertySchema = {
  type: 'number',
  icon: 'content-icon:hash:default',
  name: i18n.t('properties.number.name'),
  description: i18n.t('properties.number.description'),
};
