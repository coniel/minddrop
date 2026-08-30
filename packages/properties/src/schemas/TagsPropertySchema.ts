import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TagsPropertySchema extends PropertySchemaBase {
  type: 'tags';
}

export const TagsPropertySchema: PropertySchemaTemplate<TagsPropertySchema> = {
  type: 'tags',
  icon: 'content-icon:tags:default',
  name: 'properties.tags.name',
  description: 'properties.tags.description',
};
