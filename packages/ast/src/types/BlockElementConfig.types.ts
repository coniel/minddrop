import { BlockElement } from './BlockElement.types';

export interface BlockElementConfig<
  TBlock extends BlockElement = BlockElement,
> {
  /**
   * The type of BlockElement this config is for.
   */
  type: string;

  /**
   * Parses one or more lines of markdown text, returning a BlockElement
   * or `null` if the line is not a match for the parser's rules.
   *
   * @param line - The current line being parsed.
   * @param cosume - Consumes the current line or specified number of lines.
   * @param nextLine - Returns the next line. Subsequent calls return subsequent lines. Returns `null` if there is no next line (end of file).
   * @returns The parsed BlockElement(s) or `null` if the line is not a match.
   */
  fromMarkdown(
    line: string,
    consume: (lineCount?: number) => void,
    nextLine: () => string | null,
  ): TBlock | TBlock[] | null;

  /**
   * Stringifies a BlockElement into markdown text.
   *
   * @param element - The BlockElement to stringify.
   * @returns The markdown text.
   */
  toMarkdown(element: TBlock): string;

  /**
   * Stringifies an array of consecutive BlockElements into markdown text.
   *
   * @param elements - The BlockElements to stringify.
   * @returns The markdown text.
   */
  stringifyBatchToMarkdown?(element: TBlock[]): string;

  /**
   * Stringifies a BlockElement into plain text.
   * If not provided, the element's children are stringified.
   *
   * @param element - The element to stringify.
   * @returns The plain text representation of the element.
   */
  toPlainText?(element: TBlock): string;
}

export type BlockElementParser<T extends BlockElement = BlockElement> =
  BlockElementConfig<T>['fromMarkdown'];

export type BlockElementStringifier<T extends BlockElement = BlockElement> =
  BlockElementConfig<T>['toMarkdown'];

export type BatchBlockElementStringifier<
  T extends BlockElement = BlockElement,
> = (element: T[]) => string;
