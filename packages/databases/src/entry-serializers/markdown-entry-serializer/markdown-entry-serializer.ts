import { Markdown } from '@minddrop/markdown';
import { PropertyMap } from '@minddrop/properties';
import { DatabaseEntrySerializer } from '../../types';

export const markdownEntrySerializer: DatabaseEntrySerializer = {
  id: 'markdown',
  name: 'databases.entrySerializers.markdown.name',
  description: 'databases.entrySerializers.markdown.description',
  fileExtension: 'md',
  serialize: (schema, properties, existingContent) => {
    // The content property's value is the file body, every other
    // property is frontmatter.
    const contentProperty = schema.find(
      (property) => property.type === 'content',
    );
    const content = contentProperty ? properties[contentProperty.name] : null;
    const frontmatterProperties: PropertyMap = {};

    Object.entries(properties).forEach(([key, value]) => {
      if (key !== contentProperty?.name) {
        frontmatterProperties[key] = value;
      }
    });

    // Add the remaining properties as frontmatter, merging into the
    // entry's existing frontmatter so unmodelled keys and formatting survive.
    return Markdown.setProperties(
      schema,
      frontmatterProperties,
      typeof content === 'string' ? content : '',
      { existingContent },
    );
  },
  deserialize: (schema, serializedProperties) => {
    // Get the markdown content and properties
    const markdown = Markdown.getContent(serializedProperties);
    const properties = Markdown.getProperties(schema, serializedProperties);

    // The file body is the content property's value
    const contentProperty = schema.find(
      (property) => property.type === 'content',
    );

    if (contentProperty) {
      properties[contentProperty.name] = markdown;
    }

    return properties;
  },
};
