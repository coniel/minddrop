import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface CollectionPropertySchema extends PropertySchemaBase {
  type: 'collection';
  defaultValue?: string;
}

export const CollectionPropertySchema: PropertySchemaTemplate<CollectionPropertySchema> =
  {
    type: 'collection',
    icon: 'content-icon:layers:default',
    name: 'properties.collection.name',
    description: 'properties.collection.description',
  };
