import { PropertySchemaBase, PropertySchemaTemplate } from '../types';

export interface ContentPropertySchema extends PropertySchemaBase {
  type: 'content';
  defaultValue?: string;
}

// Singleton because an entry has a single content document, which
// serializes as the entry file's body rather than a frontmatter value.
export const ContentPropertySchema: PropertySchemaTemplate<ContentPropertySchema> =
  {
    type: 'content',
    icon: 'lucide:text-quote:default',
    name: 'properties.content.name',
    description: 'properties.content.description',
    singleton: true,
  };
