import { RootContent } from './markdown.types';

export interface MarkdownApi {
  /**
   * Processes MD AST nodes into markdown.
   *
   * @nodes - MD AST nodes
   * @returns Markdown
   */
  fromMdast(nodes: RootContent[]): string;

  /**
   * Parses markdown into MD AST nodes.
   *
   * @param markdown - The markdown to parse.
   * @returns MD AST nodes.
   */
  parse(markdown: string): RootContent[];

  /**
   * Parses HTML into markdown.
   *
   * @param html - The HTML to parse.
   * @returns The parsed markdown.
   */
  fromHtml(html: string): Promise<string>;

  /**
   * Parses a markdown file's content into MD AST nodes.
   *
   * @param path - The path to the markdown file.
   * @returns A token list.
   */
  parseFile(path: string): Promise<RootContent[]>;

  /**
   * Updates the heading of a markdown document.
   *
   * @param markdown - The markdown document.
   * @param heading - The new heading text.
   * @returns The updated markdown document.
   */
  updateHeading(markdown: string, heading: string): string;

  /**
   * Updates the heading of a markdown file.
   *
   * @param path - The path to the markdown file.
   * @param heading - The new heading text.
   */
  updateFileHeading(path: string, heading: string): Promise<void>;

  /**
   * Converts MD AST nodes into a markdown document and writes
   * it to a file.
   *
   * @param path - The markdown file path.
   * @param nodes - The MD AST nodes.
   */
  writeFile(path: string, nodes: RootContent[]): Promise<void>;
}
