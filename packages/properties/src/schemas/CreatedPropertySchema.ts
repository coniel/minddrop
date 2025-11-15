import { PropertySchemaBase } from '../types';

export interface CreatedPropertySchema extends PropertySchemaBase {
  type: 'created';
}

export const CreatedPropertySchema: CreatedPropertySchema = {
  type: 'created',
  icon: 'content-icon:clock:default',
  name: 'properties.created.name',
  description: 'properties.created.description',
  meta: true,
};
