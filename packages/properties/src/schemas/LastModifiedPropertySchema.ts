import { PropertySchemaBase } from '../types';

export interface LastModifiedPropertySchema extends PropertySchemaBase {
  type: 'last-modified';
}

export const LastModifiedPropertySchema: LastModifiedPropertySchema = {
  type: 'last-modified',
  icon: 'content-icon:clock:default',
  name: 'properties.lastModified.name',
  description: 'properties.lastModified.description',
  meta: true,
};
