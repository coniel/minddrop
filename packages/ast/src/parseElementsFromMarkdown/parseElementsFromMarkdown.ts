import { uuid } from '@minddrop/utils';
import { ParagraphElement } from '../element-configs';
import {
  BlockquoteFrame,
  Element,
  FootnoteDefinitionFrame,
  Frame,
  ListItemFrame,
} from '../types';
import { generateElement, resolveAncestryPrefixes } from '../utils';
import { mapBlockElement } from './mapBlockElement';
import {
  MdastNode,
  endOffset,
  lineStartOffset,
  parseMdast,
  sliceNode,
  startOffset,
} from './mdast';

const OrderedMarkerPattern = /^(\d+)([.)])/;
const UnorderedMarkerPattern = /^([-*+])/;
const TaskBoxPattern = /^(?:[-*+]|\d+[.)])[ \t]+\[([ xX])\][ \t]*/;

/**
 * A block along with where its source began and ended, which the spacing
 * pass needs and the element itself does not carry.
 */
interface ParsedBlock {
  element: Element;

  /**
   * Where the block's line prefix begins, which is the start of its first
   * line rather than the start of its content.
   */
  prefixStart: number;

  /**
   * Where the block's content ends.
   */
  contentEnd: number;
}

/**
 * Parses a markdown document into a flat list of blocks.
 *
 * Containers become ancestry frames rather than elements, and every block
 * keeps the source it was parsed from along with the whitespace around it,
 * so a document which is not edited is reproduced byte for byte.
 *
 * @param markdown - The markdown to parse.
 * @returns The document's blocks.
 */
export function parseElementsFromMarkdown(markdown: string): Element[] {
  const parsed: ParsedBlock[] = [];

  collectBlocks(parseMdast(markdown), [], markdown, parsed);

  // An empty or whitespace only document still needs a block to edit, and
  // its whitespace is the only thing to preserve.
  if (!parsed.length) {
    return [
      generateElement<ParagraphElement>('paragraph', {
        spacingBefore: markdown,
      }),
    ];
  }

  return applySpacing(parsed, markdown);
}

/**
 * Walks the mdast tree, turning containers into frames and everything else
 * into blocks.
 *
 * @param nodes - The nodes to walk.
 * @param ancestry - The containers the nodes sit inside.
 * @param source - The document being parsed.
 * @param parsed - The blocks collected so far, appended to.
 * @param contentStart - Where the first node's content begins, when its
 * position includes part of the container's prefix.
 */
function collectBlocks(
  nodes: MdastNode[],
  ancestry: Frame[],
  source: string,
  parsed: ParsedBlock[],
  contentStart = 0,
): void {
  nodes.forEach((node, index) => {
    // A quote contributes a frame to everything inside it
    if (node.type === 'blockquote') {
      const frame = buildBlockquoteFrame(node, source);

      collectBlocks(node.children || [], [...ancestry, frame], source, parsed);

      return;
    }

    // A list is not a frame: its items are, so that adjacent items stay
    // peers rather than siblings inside a wrapper.
    if (node.type === 'list') {
      (node.children || []).forEach((item) => {
        const frame = buildListItemFrame(item, node, ancestry, source);

        collectBlocks(
          item.children || [],
          [...ancestry, frame],
          source,
          parsed,
          resolveTaskContentStart(item, source),
        );
      });

      return;
    }

    // A footnote definition contributes a frame to its content
    if (node.type === 'footnoteDefinition') {
      const frame = buildFootnoteFrame(node);

      collectBlocks(node.children || [], [...ancestry, frame], source, parsed);

      return;
    }

    const element = mapBlockElement(node, source);

    element.ancestry = ancestry.length ? ancestry : undefined;
    // The block's slice excludes the first line's prefix, which the
    // ancestry rebuilds, but includes the prefixes of any further lines.
    // The first block's position may still include part of the prefix,
    // which is skipped so that it is not carried twice.
    const start = Math.max(startOffset(node), index === 0 ? contentStart : 0);

    element.source = source.slice(start, endOffset(node));

    parsed.push({
      element,
      prefixStart: lineStartOffset(source, startOffset(node)),
      contentEnd: endOffset(node),
    });
  });
}

/**
 * Records the whitespace around each block, which is what reproduces blank
 * line runs, leading whitespace and the file's final newline.
 *
 * @param parsed - The parsed blocks.
 * @param source - The document being parsed.
 * @returns The blocks, with their spacing recorded.
 */
function applySpacing(parsed: ParsedBlock[], source: string): Element[] {
  return parsed.map((block, index) => {
    const next = parsed[index + 1];

    // Anything before the first block's prefix is the document's own
    // leading whitespace.
    if (index === 0) {
      block.element.spacingBefore = source.slice(0, block.prefixStart);
    }

    block.element.spacingAfter = source.slice(
      block.contentEnd,
      next ? next.prefixStart : source.length,
    );

    return block.element;
  });
}

/**
 * Builds the frame a block quote contributes.
 *
 * @param node - The blockquote node.
 * @param source - The document being parsed.
 * @returns The frame.
 */
function buildBlockquoteFrame(
  node: MdastNode,
  source: string,
): BlockquoteFrame {
  const opening = source.slice(startOffset(node), startOffset(node) + 2);

  return {
    id: uuid(),
    kind: 'blockquote',
    syntax: opening === '> ' ? '> ' : '>',
  };
}

/**
 * Builds the frame a footnote definition contributes.
 *
 * @param node - The footnote definition node.
 * @returns The frame.
 */
function buildFootnoteFrame(node: MdastNode): FootnoteDefinitionFrame {
  return {
    id: uuid(),
    kind: 'footnote-definition',
    identifier: node.identifier || '',
    label: node.label,
  };
}

/**
 * Builds the frame a list item contributes, reading its marker from the
 * source since mdast records only whether the list is ordered.
 *
 * @param item - The list item node.
 * @param list - The list the item belongs to.
 * @param ancestry - The containers the item sits inside.
 * @param source - The document being parsed.
 * @returns The frame.
 */
function buildListItemFrame(
  item: MdastNode,
  list: MdastNode,
  ancestry: Frame[],
  source: string,
): ListItemFrame {
  const slice = sliceNode(item, source);
  const ordered = !!list.ordered;
  const orderedMarker = OrderedMarkerPattern.exec(slice);
  const unorderedMarker = UnorderedMarkerPattern.exec(slice);

  const frame: ListItemFrame = {
    id: uuid(),
    kind: 'list-item',
    ordered,
    marker: resolveMarker(ordered, orderedMarker, unorderedMarker),
    indent: resolveIndent(item, ancestry, source),
    spread: !!(item.spread || list.spread),
  };

  // Only ordered items carry a number, kept as authored since CommonMark
  // honours only the list's first.
  if (ordered && orderedMarker) {
    frame.number = Number(orderedMarker[1]);
  }

  // A checked state is what makes the item a task item, so a plain item
  // must not carry one at all.
  if (item.checked === true || item.checked === false) {
    frame.checked = item.checked;
    frame.checkedSyntax = readCheckedSyntax(slice);
  }

  return frame;
}

/**
 * Returns where a task item's content begins, which is past its checkbox.
 * mdast moves a paragraph's start past the box only when the paragraph
 * opens with plain text, so a paragraph opening with an inline element
 * still has the box inside its position.
 *
 * @param item - The list item node.
 * @param source - The document being parsed.
 * @returns The offset the content begins at, or 0 for a plain item.
 */
function resolveTaskContentStart(item: MdastNode, source: string): number {
  // Only a task item has a box to skip
  if (item.checked !== true && item.checked !== false) {
    return 0;
  }

  // Match the box on the item's source
  const box = TaskBoxPattern.exec(sliceNode(item, source));

  // Check that a box was found. mdast only marks an item as a task
  // when one is present, so this is a safeguard.
  if (!box) {
    return 0;
  }

  // Return the offset just past the box
  return startOffset(item) + box[0].length;
}

/**
 * Returns the character inside a task item's checkbox as authored, since a
 * checked box can be written with either case.
 *
 * @param slice - The list item's source.
 * @returns The checkbox's character.
 */
function readCheckedSyntax(slice: string): string {
  const box = TaskBoxPattern.exec(slice);

  return box ? box[1] : ' ';
}

/**
 * Returns the marker character a list item was written with.
 *
 * @param ordered - Whether the item belongs to an ordered list.
 * @param orderedMarker - The ordered marker match, if any.
 * @param unorderedMarker - The unordered marker match, if any.
 * @returns The marker.
 */
function resolveMarker(
  ordered: boolean,
  orderedMarker: RegExpExecArray | null,
  unorderedMarker: RegExpExecArray | null,
): string {
  if (ordered) {
    return orderedMarker ? orderedMarker[2] : '.';
  }

  return unorderedMarker ? unorderedMarker[1] : '-';
}

/**
 * Returns the indentation an item carries beyond what its containers
 * already contribute, so that a nested item is not indented twice.
 *
 * @param item - The list item node.
 * @param ancestry - The containers the item sits inside.
 * @param source - The document being parsed.
 * @returns The item's own indentation.
 */
function resolveIndent(
  item: MdastNode,
  ancestry: Frame[],
  source: string,
): string {
  const markerStart = startOffset(item);
  const gap = source.slice(lineStartOffset(source, markerStart), markerStart);
  const containerPrefix = resolveAncestryPrefixes(
    ancestry,
    ancestry,
  ).continuation;

  return gap.slice(containerPrefix.length);
}
