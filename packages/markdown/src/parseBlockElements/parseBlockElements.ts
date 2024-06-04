import { BlockElement } from '@minddrop/editor';
import { BlockElementParserConfig } from '../types';
import { MarkdownParseError } from '../errors';

/**
 * Does something useful.
 */
export function parseBlockElements(
  markdown: string,
  parsers: BlockElementParserConfig['parser'][],
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

  function getNextLine() {
    const nextLine = lines[nextLineIndex];
    nextLineIndex += 1;

    return nextLine === undefined ? null : nextLine;
  }

  function resetNextLineIndex() {
    nextLineIndex = currentLineIndex + 1;
  }

  function consume(numberOfLines = 1) {
    didConsume = true;
    currentLineIndex += numberOfLines;
    resetNextLineIndex();
  }

  function resetDidConsume() {
    didConsume = false;
  }

  function ensureConsumed() {
    if (!didConsume) {
      throw new MarkdownParseError(
        'Parser returned elements without consuming any lines',
      );
    }
  }

  while (currentLineIndex < lines.length) {
    let foundMatch = false;
    resetDidConsume();

    if (lines[currentLineIndex] === '') {
      consume();
      continue;
    }

    for (let parser of parsers) {
      resetNextLineIndex();
      const match = parser(lines[currentLineIndex], consume, getNextLine);

      if (Array.isArray(match) && match.length > 0) {
        ensureConsumed();
        elements.push(...match);
        foundMatch = true;
        break;
      }

      if (match && !Array.isArray(match)) {
        ensureConsumed();
        elements.push(match);
        foundMatch = true;
        break;
      }

      if (didConsume) {
        throw new MarkdownParseError(
          'Parser consumed lines but did not return any elements',
        );
      }
    }

    if (!foundMatch) {
      // If no parser matched, we assume the line is a paragraph
      elements.push({
        level: 'block',
        type: 'paragraph',
        children: [{ text: lines[currentLineIndex] }],
      });
      consume();
    }
  }

  return elements;
}
