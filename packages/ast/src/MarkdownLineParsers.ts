import {
  parseHeadingElementFromMarkdown,
  parseListItemFromMarkdown,
  parseParagraphElementFromMarkdown,
  parseThematicBreakElementFromMarkdown,
} from './element-configs';
import { MarkdownLineParser } from './types';

/**
 * The line parsers used to read a document, in the order they are tried.
 *
 * The paragraph parser matches any line, so it comes last as the fallback.
 */
export const MarkdownLineParsers: MarkdownLineParser[] = [
  parseHeadingElementFromMarkdown,
  parseThematicBreakElementFromMarkdown,
  parseListItemFromMarkdown,
  parseParagraphElementFromMarkdown,
];
