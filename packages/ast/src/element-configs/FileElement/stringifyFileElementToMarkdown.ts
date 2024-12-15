import { FileElement } from './FileElement.types';

/**
 * Stringifies a FileElement into a markdown file embed.
 *
 * @param element - The FileElement to stringify.
 * @returns The markdown text.
 */
export const stringifyFileElementToMarkdown = (element: FileElement) => {
  const description = element.description ? ` "${element.description}"` : '';

  return `![${element.title}](${element.filename}${description})`;
};
