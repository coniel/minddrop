import { Test } from 'unist-util-is';
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
  fromHtml(html: string): string;

  /**
   * Updates the heading of a markdown document.
   *
   * @param markdown - The markdown document.
   * @param heading - The new heading text.
   * @returns The updated markdown document.
   */
  updateHeading(markdown: string, heading: string): string;

  /**
   * Converts MD AST node(s) into string content.
   *
   *  @param node - A single or array of MD AST nodes.
   *  @returns The string content of the node(s).
   */
  toString(node: RootContent | RootContent[]): string;

  /**
   * Checks if a node pass a test.
   *
   * @param node - The node to test.
   * @test - unist-util-is compatible test.
   */
  is(node: RootContent, test?: Test): boolean;

  /**
   * Removes all nodes that pass a test from the given nodes.
   *
   * @param nodes - The nodes from which to remove.
   * @test - unist-util-is compatible test.
   */
  remove(nodes: RootContent[], test?: Test): void;
}
