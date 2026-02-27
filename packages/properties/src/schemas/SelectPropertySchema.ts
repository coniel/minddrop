import { ContentColor } from '@minddrop/theme';
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
  name: 'properties.select.name',
  description: 'properties.select.description',
  options: [],
};
