import { BlockElementStringifier } from '../../types';
import { FileElement } from './FileElement.types';

/**
 * Stringifies a FileElement into a markdown file embed.
 *
 * @param element - The FileElement to stringify.
 * @returns The markdown text.
 */
export const stringifyFileElementToMarkdown: BlockElementStringifier<
  FileElement
> = (element) => {
  const description = element.description ? ` "${element.description}"` : '';

  return `![${element.title}](${element.filename}${description})`;
};
