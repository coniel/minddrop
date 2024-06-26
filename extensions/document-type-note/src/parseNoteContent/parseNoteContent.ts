import { Ast, BlockElement } from '@minddrop/ast';
import { Markdown } from '@minddrop/markdown';

/**
 * Parses the content of a note file into a list of block elements.
 *
 * @param fileTextContent - The content of the note file.
 * @returns A list of block elements.
 */
export function parseNoteContent(fileTextContent: string): BlockElement[] {
  // Get the pure markdown content
  const markdown = Markdown.removeFrontmatter(fileTextContent);

  // Return parsed markdown content
  return Ast.fromMarkdown(markdown);
}
