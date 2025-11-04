import { i18n } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/utils';
import { PropertySchemaBase } from '../types';

export interface SelectPropertyOption {
  value: string;
  color: ContentColor;
}

export interface SelectPropertySchema extends PropertySchemaBase {
  type: 'select';
  options: SelectPropertyOption[];
  defaultValue?: string;
  multiselect?: boolean;
}

export const SelectPropertySchema: SelectPropertySchema = {
  type: 'select',
  icon: 'content-icon:chevron-down-circle:default',
  name: i18n.t('properties.select.name'),
  description: i18n.t('properties.select.description'),
  options: [],
};
