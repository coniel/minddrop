import { TokenList } from './markdown.types';

export interface MarkdownApi {
  /**
   * Parses markdown into tokens.
   *
   * @param markdown - The markdown to parse.
   * @returns A token list.
   */
  parse(markdown: string): TokenList;

  /**
   * Parses a markdown file's content into tokens.
   *
   * @param path - The path to the markdown file.
   * @returns A token list.
   */
  parseFile(path: string): Promise<TokenList>;

  /**
   * Converts tokens into a markdown document.
   *
   * @param tokens - A token list.
   * @returns Markdown document.
   */
  toMarkdown(tokens: TokenList): string;

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
   * Converts tokens into a markdown document and writes
   * it to a file.
   *
   * @param path - The markdown file path.
   * @param tokens - A token list.
   */
  writeFile(path: string, tokens: TokenList): Promise<void>;
}
