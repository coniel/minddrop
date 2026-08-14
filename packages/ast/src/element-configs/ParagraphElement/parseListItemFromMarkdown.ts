import { uuid } from '@minddrop/utils';
import { parseInlineMarkdown } from '../../parseInlineMarkdown';
import { ListItemFrame, MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { ParagraphElement } from './ParagraphElement.types';

const UnorderedItemPattern = /^([ \t]*)([-*+])[ \t]+(.*)$/;
const OrderedItemPattern = /^([ \t]*)(\d+)([.)])[ \t]+(.*)$/;
const TaskBoxPattern = /^\[([ xX])\][ \t]+(.*)$/;

/**
 * Parses a list item into a paragraph carrying a list item frame. Items are
 * not elements: the document stays flat and containment lives in the
 * ancestry.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A paragraph element inside a list item frame, or null.
 */
export const parseListItemFromMarkdown: MarkdownLineParser = (
  line,
  consume,
) => {
  const frame = parseItemFrame(line);

  if (!frame) {
    return null;
  }

  consume();

  return generateElement<ParagraphElement>('paragraph', {
    ancestry: [frame.frame],
    children: parseInlineMarkdown(frame.content),
  });
};

/**
 * Matches a line against the ordered and unordered item patterns.
 *
 * @param line - The line to parse.
 * @returns The item's frame and remaining content, or null.
 */
function parseItemFrame(
  line: string,
): { frame: ListItemFrame; content: string } | null {
  const unordered = UnorderedItemPattern.exec(line);

  if (unordered) {
    const [, indent, marker, content] = unordered;

    return buildFrame({ indent, marker, ordered: false, content });
  }

  const ordered = OrderedItemPattern.exec(line);

  if (ordered) {
    const [, indent, number, marker, content] = ordered;

    return buildFrame({
      indent,
      marker,
      ordered: true,
      number: Number(number),
      content,
    });
  }

  return null;
}

interface FrameSource {
  indent: string;
  marker: string;
  ordered: boolean;
  number?: number;
  content: string;
}

/**
 * Builds the item's frame, lifting a leading task box into the frame's
 * checked state.
 *
 * @param source - The parts matched from the line.
 * @returns The item's frame and remaining content.
 */
function buildFrame(source: FrameSource): {
  frame: ListItemFrame;
  content: string;
} {
  const frame: ListItemFrame = {
    id: uuid(),
    kind: 'list-item',
    ordered: source.ordered,
    marker: source.marker,
    indent: source.indent,
  };

  // An ordered item's number is kept as authored, since only the first
  // item's number affects rendering
  if (source.ordered) {
    frame.number = source.number;
  }

  const taskBox = TaskBoxPattern.exec(source.content);

  // A task box makes the item a task list item rather than part of its text
  if (taskBox) {
    frame.checked = taskBox[1] !== ' ';

    return { frame, content: taskBox[2] };
  }

  return { frame, content: source.content };
}
