import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TogglePropertySchema extends PropertySchemaBase {
  type: 'toggle';
  defaultValue?: boolean;
}

export const TogglePropertySchema: PropertySchemaTemplate<TogglePropertySchema> =
  {
    type: 'toggle',
    icon: 'content-icon:check-square:default',
    name: 'properties.toggle.name',
    description: 'properties.toggle.description',
  };
