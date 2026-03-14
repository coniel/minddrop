import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TitlePropertySchema extends PropertySchemaBase {
  type: 'title';
}

export const TitlePropertySchema: PropertySchemaTemplate<TitlePropertySchema> =
  {
    type: 'title',
    icon: 'content-icon:type:default',
    name: 'properties.title.name',
    description: 'properties.title.description',
    protected: true,
  };
