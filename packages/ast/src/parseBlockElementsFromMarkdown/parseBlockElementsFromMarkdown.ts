import { BlockElement, BlockElementParser } from '../types';
import { ParseError } from '../errors';
import { generateBlockElement } from '../utils';
import { ParagraphElement } from '../block-element-configs/ParagraphElement';

/**
 * Parses a markdown string into a list of block elements.
 *
 * @param parsers - The parser functions to use.
 * @param markdown - The markdown string to parse.
 * @returns The list of block elements.
 */
export function parseBlockElementsFromMarkdown(
  parsers: BlockElementParser[],
  markdown: string,
): BlockElement[] {
  const elements: BlockElement[] = [];
  const lines = markdown.split('\n');
  // Index of the currnet line being parsed. Parser can consume multiple
  // lines, so this index represents the first line of the current loop.
  let currentLineIndex = 0;
  // Parsers can read ahead, so we need to keep track of the 'next' line
  // index from the parser's perspective.
  let nextLineIndex = currentLineIndex + 1;
  let didConsume = false;

  // Returns the next line from the markdown string, or null if there are no
  // more lines. Increments the next line index.
  function getNextLine() {
    const nextLine = lines[nextLineIndex];
    nextLineIndex += 1;

    return nextLine === undefined ? null : nextLine;
  }

  // Resets the next line index to the index after the current line
  function resetNextLineIndex() {
    nextLineIndex = currentLineIndex + 1;
  }

  // Consumes the given number of lines, moving the current line index
  // forward by that amount.
  function consume(numberOfLines = 1) {
    didConsume = true;
    currentLineIndex += numberOfLines;
    resetNextLineIndex();
  }

  function resetDidConsume() {
    didConsume = false;
  }

  // Throws an error if a parser did not consume any lines
  function ensureConsumed() {
    if (!didConsume) {
      throw new ParseError(
        'Parser returned elements without consuming any lines',
      );
    }
  }

  // Loop through each line of the markdown string, attempting to
  // parse it.
  while (currentLineIndex < lines.length) {
    let foundMatch = false;
    resetDidConsume();

    // Skip empty lines
    if (lines[currentLineIndex] === '') {
      consume();
      continue;
    }

    // Loop through each parser, attempting to match the current line
    // until one matches.
    for (let parser of parsers) {
      // Previous parser may have read ahead, so we need to reset the
      // next line index before each parser.
      resetNextLineIndex();

      const match = parser(lines[currentLineIndex], consume, getNextLine);

      // Parser returned multiple elements, add them to the list and move on
      // to the next line.
      if (Array.isArray(match) && match.length > 0) {
        ensureConsumed();
        elements.push(...match);
        foundMatch = true;
        break;
      }

      // Parser returned a single element, add it to the list and move on to
      // the next line.
      if (match && !Array.isArray(match)) {
        ensureConsumed();
        elements.push(match);
        foundMatch = true;
        break;
      }

      // Parser did not match but consumed lines, throw an error
      if (didConsume) {
        throw new ParseError(
          'Parser consumed lines but did not return any elements',
        );
      }
    }

    // If no parser matched, we assume the line is a paragraph
    if (!foundMatch) {
      elements.push(
        generateBlockElement<ParagraphElement>('paragraph', {
          children: [{ text: lines[currentLineIndex] }],
        }),
      );
      consume();
    }
  }

  if (!elements.length) {
    elements.push(generateBlockElement<ParagraphElement>('paragraph'));
  }

  return elements;
}
