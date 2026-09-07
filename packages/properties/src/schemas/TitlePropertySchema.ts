import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TitlePropertySchema extends PropertySchemaBase {
  type: 'title';
}

export const TitlePropertySchema: PropertySchemaTemplate<TitlePropertySchema> =
  {
    type: 'title',
    icon: 'lucide:type:default',
    name: 'properties.title.name',
    description: 'properties.title.description',
    meta: true,
  };
