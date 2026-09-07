import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface UrlPropertySchema extends PropertySchemaBase {
  type: 'url';
  defaultValue?: string;
}

export const UrlPropertySchema: PropertySchemaTemplate<UrlPropertySchema> = {
  type: 'url',
  icon: 'lucide:link:default',
  name: 'properties.url.name',
  description: 'properties.url.description',
};
