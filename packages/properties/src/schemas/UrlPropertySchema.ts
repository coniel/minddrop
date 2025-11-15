import { PropertySchemaBase } from '../types';

export interface UrlPropertySchema extends PropertySchemaBase {
  type: 'url';
  defaultValue?: string;
}

export const UrlPropertySchema: UrlPropertySchema = {
  type: 'url',
  icon: 'content-icon:link:default',
  name: 'properties.url.name',
  description: 'properties.url.description',
};
