import { PropertySchemaBase } from '../types';

export interface TextPropertySchema extends PropertySchemaBase {
  type: 'text';
  defaultValue?: string;
}

export const TextPropertySchema: TextPropertySchema = {
  type: 'text',
  icon: 'content-icon:text:default',
  name: 'properties.text.name',
  description: 'properties.text.description',
};
