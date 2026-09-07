import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface NumberPropertySchema extends PropertySchemaBase {
  type: 'number';
  defaultValue?: number;
}

export const NumberPropertySchema: PropertySchemaTemplate<NumberPropertySchema> =
  {
    type: 'number',
    icon: 'lucide:hash:default',
    name: 'properties.number.name',
    description: 'properties.number.description',
  };
