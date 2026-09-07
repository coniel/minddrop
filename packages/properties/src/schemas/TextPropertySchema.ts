import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TextPropertySchema extends PropertySchemaBase {
  type: 'text';
  defaultValue?: string;
}

export const TextPropertySchema: PropertySchemaTemplate<TextPropertySchema> = {
  type: 'text',
  icon: 'lucide:text-align-start:default',
  name: 'properties.text.name',
  description: 'properties.text.description',
};
