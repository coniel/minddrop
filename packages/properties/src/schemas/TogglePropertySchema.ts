import { PropertySchemaBase } from '../types';

export interface TogglePropertySchema extends PropertySchemaBase {
  type: 'toggle';
  defaultValue?: boolean;
}

export const TogglePropertySchema: TogglePropertySchema = {
  type: 'toggle',
  icon: 'content-icon:check-square:default',
  name: 'properties.toggle.name',
  description: 'properties.toggle.description',
};
