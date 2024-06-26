import yaml from 'yaml';
import { Ast, BlockElement } from '@minddrop/ast';
import { DocumentProperties } from '@minddrop/documents';
import { DefaultNoteProperties } from '../constants';

/**
 * Stringify a note document into a markdown string with properties
 * stored as YAML front matter.
 *
 * @param properties - The properties of the note document.
 * @param content - The content of the note document.
 * @returns The note document as a markdown string.
 */
export function stringifyNote(
  properties: DocumentProperties,
  content: BlockElement[],
): string {
  // Stringify the content as markdown
  const contentString = Ast.toMarkdown(content);

  // Get properties which do not have a value equal to the default
  const nonDefaultProperties = { ...properties };
  Object.entries(DefaultNoteProperties).forEach(([key, value]) => {
    if (nonDefaultProperties[key] === value) {
      delete nonDefaultProperties[key];
    }
  });

  // If all properties are default, the stringified note is just
  // the stringified content.
  if (!Object.keys(nonDefaultProperties).length) {
    return contentString;
  }

  // Stringify the properties as YAML
  const propertiesString = yaml.stringify(nonDefaultProperties);

  // Add YAML front matter above the markdown content
  return `---\n${propertiesString}---\n\n${contentString}`;
}
