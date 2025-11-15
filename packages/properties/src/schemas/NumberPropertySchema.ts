import { PropertySchemaBase } from '../types';

export interface NumberPropertySchema extends PropertySchemaBase {
  type: 'number';
  defaultValue?: number;
}

export const NumberPropertySchema: NumberPropertySchema = {
  type: 'number',
  icon: 'content-icon:hash:default',
  name: 'properties.number.name',
  description: 'properties.number.description',
};
