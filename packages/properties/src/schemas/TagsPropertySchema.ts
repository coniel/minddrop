import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface TagsPropertySchema extends PropertySchemaBase {
  type: 'tags';

  /**
   * The ID of the tag group the property's selection is limited
   * to. Absent when all tags are selectable.
   */
  group?: string;
}

export const TagsPropertySchema: PropertySchemaTemplate<TagsPropertySchema> = {
  type: 'tags',
  icon: 'content-icon:tags:default',
  name: 'properties.tags.name',
  description: 'properties.tags.description',
};
