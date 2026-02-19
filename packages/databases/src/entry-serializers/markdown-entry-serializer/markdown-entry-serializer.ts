import { Markdown } from '@minddrop/markdown';
import { PropertyMap } from '@minddrop/properties';
import { DatabaseEntrySerializer } from '../../types';
import { getFormattedTextPropertiesFromMarkdown } from './getFormattedTextPropertiesFromMarkdown';

export const markdownEntrySerializer: DatabaseEntrySerializer = {
  id: 'markdown',
  name: 'databases.entrySerializers.markdown.name',
  description: 'databases.entrySerializers.markdown.description',
  fileExtension: 'md',
  serialize: (schema, properties) => {
    let markdown = '';

    // Find all formatted text properties
    const formattedTextProperties = Object.entries(properties).filter(
      ([key]) =>
        schema.find((prop) => prop.name === key)?.type === 'formatted-text',
    );
    // Get non-formatted text properties
    const nonFormattedTextProperties: PropertyMap = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (!formattedTextProperties.find(([propKey]) => propKey === key)) {
        nonFormattedTextProperties[key] = value;
      }
    });

    // If there is only one formatted text property, use its value as the markdown content
    if (formattedTextProperties.length === 1) {
      markdown = formattedTextProperties[0][1] as string;
    }

    // If there are multiple formatted text properties, use a heading for each property
    if (formattedTextProperties.length > 1) {
      formattedTextProperties.forEach(([key, value]) => {
        markdown += `## ${key}\n\n${value}\n\n`;
      });

      // Remove the last newline
      markdown = markdown.slice(0, -2);
    }

    // Add the non-formatted text properties as frontmatter
    return Markdown.setProperties(schema, nonFormattedTextProperties, markdown);
  },
  deserialize: (schema, serializedProperties) => {
    // Get the markdown content and properties
    const markdown = Markdown.getContent(serializedProperties);
    let properties = Markdown.getProperties(schema, serializedProperties);

    // Get formatted text properties from the schema
    const formattedTextProperties = schema
      .filter((property) => property.type === 'formatted-text')
      .map((property) => property.name);

    // If there is only one formatted text property, use the entire markdown content as its value
    if (formattedTextProperties.length === 1) {
      properties[formattedTextProperties[0]] = markdown;
    }

    if (formattedTextProperties.length > 1) {
      // Split the markdown content by the formatted text properties
      const splitMarkdown = getFormattedTextPropertiesFromMarkdown(
        markdown,
        formattedTextProperties,
      );

      // Add the formatted text properties as properties
      properties = {
        ...properties,
        ...splitMarkdown,
      };
    }

    return properties;
  },
};
