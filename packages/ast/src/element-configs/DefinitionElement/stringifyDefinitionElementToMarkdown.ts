import { DefinitionElement } from './DefinitionElement.types';

/**
 * Stringifies a link reference definition into markdown.
 *
 * @param element - The definition element to stringify.
 * @returns A markdown link reference definition string.
 */
export const stringifyDefinitionElementToMarkdown = (
  element: DefinitionElement,
): string => {
  const label = element.label || element.identifier;
  const definition = `[${label}]: ${element.url}`;

  // The title is optional and follows the destination
  if (element.title) {
    return `${definition} "${element.title}"`;
  }

  return definition;
};
