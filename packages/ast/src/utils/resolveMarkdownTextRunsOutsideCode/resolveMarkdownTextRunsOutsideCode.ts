import { resolveIndentationWidth } from '@minddrop/utils';
import { MarkdownTabWidth } from '../../constants';
import { isClosingCodeFence } from '../isClosingCodeFence';
import { parseCodeFenceOpening } from '../parseCodeFenceOpening';
import { parseListItemMarker } from '../parseListItemMarker';
import { resolveTextRunsOutsideCodeSpans } from '../resolveTextRunsOutsideCodeSpans';

// An ATX heading. Headings are blocks of their own, not paragraphs.
const HeadingPattern = /^#{1,6}(\s|$)/;

// A thematic break: three or more of the same `-`, `*` or `_`, optionally
// spaced.
const ThematicBreakPattern = /^([-*_])(?:[ \t]*\1){2,}[ \t]*$/;

// A setext heading underline, which ends the paragraph above it
const SetextUnderlinePattern = /^(?:=+|-+)[ \t]*$/;

// The indentation which starts an indented code block. Measured from the
// content column of the line's container.
const CodeIndentation = 4;

/**
 * Resolves the runs of text in a markdown document which lie outside code,
 * in document order. Line breaks, code blocks and inline code spans end a
 * run. Empty runs are left out.
 *
 * Returns indented code inside a blockquote, and raw HTML, as text.
 *
 * @param markdown - The markdown document.
 * @returns The runs of text outside code.
 */
export function resolveMarkdownTextRunsOutsideCode(markdown: string): string[] {
  // The runs of text outside code
  const runs: string[] = [];
  // The content columns of the open list items, innermost last
  const listItemColumns: number[] = [];
  // The fenced code block the current line is in
  let fence: { marker: string; column: number } | null = null;
  // Whether the previous line is paragraph text. An indented line continues
  // a paragraph rather than starting code.
  let inParagraph = false;

  for (const line of markdown.split('\n')) {
    // Resolve the line's content and indentation width
    const content = line.trimStart();
    const indentation = resolveIndentationWidth(line, MarkdownTabWidth);

    // Check if the line is blank. If so, end the paragraph. Code blocks and
    // list items stay open.
    if (!content) {
      inParagraph = false;

      continue;
    }

    if (fence) {
      // Check the line is still indented into the code block's container.
      // If so, skip it.
      if (indentation >= fence.column) {
        // Check if the line is a closing fence indented less than four
        // columns past the container. If so, leave the code block.
        if (
          indentation - fence.column < CodeIndentation &&
          isClosingCodeFence(content, fence.marker)
        ) {
          fence = null;
        }

        continue;
      }

      // Close the code block with the list item it is in
      fence = null;
    }

    // Identify the blocks the line can open. A thematic break takes
    // precedence over a list item, and a setext underline needs a
    // paragraph above it.
    const opening = parseCodeFenceOpening(content);
    const isHeading = HeadingPattern.test(content);
    const isBreak: boolean =
      ThematicBreakPattern.test(content) ||
      (inParagraph && SetextUnderlinePattern.test(content));
    const listItem = isBreak ? null : parseListItemMarker(content, indentation);

    // Check if the line continues a paragraph without opening a block. If
    // not, close the list items it is indented less than.
    if (!inParagraph || opening || isHeading || isBreak || listItem) {
      while (
        listItemColumns.length &&
        indentation < listItemColumns[listItemColumns.length - 1]
      ) {
        listItemColumns.pop();
      }
    }

    // Measure the line's indentation from the content column of the list
    // item it is in.
    const containerColumn = listItemColumns[listItemColumns.length - 1] ?? 0;
    const relativeIndentation = indentation - containerColumn;

    // Check if the line is indented four columns past its container's
    // content column, outside a paragraph. If so, skip it as indented code.
    if (relativeIndentation >= CodeIndentation && !inParagraph) {
      continue;
    }

    // Check if the line opens a fence indented less than four columns past
    // its container. If so, enter a fenced code block, ending the
    // paragraph, and skip the fence.
    if (opening && relativeIndentation < CodeIndentation) {
      fence = { marker: opening, column: containerColumn };
      inParagraph = false;

      continue;
    }

    // The content of the block the line opens, after any list item marker
    let blockContent = content;

    if (listItem) {
      // Open the list item
      listItemColumns.push(listItem.contentColumn);

      // Check if the item's content is indented code. If so, skip the line.
      if (
        resolveIndentationWidth(listItem.content, MarkdownTabWidth) >=
        CodeIndentation
      ) {
        inParagraph = false;

        continue;
      }

      blockContent = listItem.content.trimStart();

      // Check if the item's content opens a fence. If so, enter a fenced
      // code block in the item and skip the line.
      const itemOpening = parseCodeFenceOpening(blockContent);

      if (itemOpening) {
        fence = { marker: itemOpening, column: listItem.contentColumn };
        inParagraph = false;

        continue;
      }
    }

    // Add the text either side of each code span
    runs.push(...resolveTextRunsOutsideCodeSpans(line));

    // Continue the paragraph, unless the line is a break, a heading or an
    // empty list item.
    inParagraph =
      !isBreak && blockContent !== '' && !HeadingPattern.test(blockContent);
  }

  return runs;
}
