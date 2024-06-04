import { BlockElement } from '@minddrop/editor';
import { BlockElementParser } from './BlockElementParser.types';

export interface BlockElementParserConfig {
  /**
   * The BlockElement type that the parser creates.
   */
  type: string;

  /**
   * The parser function that creates BlockElement(s) from markdown text.
   */
  parser: BlockElementParser;
}
