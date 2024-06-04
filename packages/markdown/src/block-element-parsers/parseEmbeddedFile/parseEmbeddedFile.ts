import { FileElement, ImageElement } from '@minddrop/editor';
import { BlockElementParser } from '../../types';

/**
 * Parses embedded files and images in markdown syntax.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A file or image element if the line is a match, otherwise null.
 */
export const parseEmbeddedFile: BlockElementParser = (
  line,
  consume,
): FileElement | ImageElement | null => {
  // Regex for matching embedded files in markdown syntax
  const fileRegex = /^!\[(.*)\]\((.+?)(?: "(.*)")?\)$/;
  const match = line.match(fileRegex);

  // If the line is a match, consume the line and return
  // a file element.
  if (match) {
    const [, title, filename, description] = match;

    consume();

    return {
      type: isImage(filename) ? 'image' : 'file',
      level: 'block',
      filename,
      title: title || filename,
      description: description || '',
      extension: filename.split('.').pop() || '',
      children: [{ text: '' }],
    };
  }

  return null;
};

function isImage(filename: string): boolean {
  return /\.(png|jpe?g|gif|svg|bmp|webp)$/i.test(filename);
}
