import { getElementTypeConfig } from '../ElementTypeConfigs';
import { SerializationError } from '../errors';
import { Element, Frame } from '../types';
import {
  AncestryPrefixes,
  isSameList,
  resolveAncestryPrefixes,
  resolveInnermostListItem,
  resolveListItemNumbers,
  resolveSharedFrameDepth,
} from '../utils';

/**
 * Stringifies an array of blocks to markdown.
 *
 * The document is flat, so containers are rebuilt from each block's
 * ancestry: every line is prefixed by what its containers contribute, and
 * the gap between two blocks is decided by the containers they share.
 *
 * @param elements - The blocks to stringify.
 * @returns The markdown string.
 * @throws SerializationError if a block has no element type config.
 */
export function stringifyElementsToMarkdown(elements: Element[]): string {
  const numbers = resolveListItemNumbers(elements);
  // Leading whitespace belongs to the document rather than to any block
  let markdown = elements[0]?.spacingBefore ?? '';

  elements.forEach((element, index) => {
    const config = getElementTypeConfig(element.type);

    // Skipping the block would silently destroy the user's content, so an
    // unknown type is a bug rather than something to swallow
    if (!config) {
      throw new SerializationError(
        `No element type config found for '${element.type}'`,
      );
    }

    const previous = elements[index - 1];

    // Separate the block from the one before it, preferring the spacing the
    // document was written with
    if (previous) {
      markdown +=
        previous.spacingAfter ?? resolveSeparator(previous, element, numbers);
    }

    const prefixes = resolveAncestryPrefixes(
      element.ancestry,
      previous?.ancestry,
      numbers,
    );

    // An untouched block writes back the slice it was parsed from, which is
    // the only way its exact spelling survives. An edited one no longer has
    // one, and is rebuilt from its own data.
    const body = element.source ?? config.toMarkdown(element);

    markdown += applyPrefixes(body, prefixes, element.source !== undefined);
  });

  // Trailing whitespace is held by the last block, since there is no block
  // after it to lead
  return markdown + (elements[elements.length - 1]?.spacingAfter ?? '');
}

/**
 * Prefixes a block's lines with what its containers contribute.
 *
 * A block's own slice already carries the prefixes of every line but its
 * first, since only the first line's prefix sits before the offset the
 * block was sliced from.
 *
 * @param markdown - The block's markdown.
 * @param prefixes - The prefixes the block's containers contribute.
 * @param fromSource - Whether the markdown is the block's own slice.
 * @returns The prefixed markdown.
 */
function applyPrefixes(
  markdown: string,
  prefixes: AncestryPrefixes,
  fromSource: boolean,
): string {
  if (fromSource) {
    return `${prefixes.first}${markdown}`;
  }

  return markdown
    .split('\n')
    .map((line, index) => {
      const prefix = index === 0 ? prefixes.first : prefixes.continuation;

      // A prefix on an otherwise empty line would leave trailing whitespace
      return line ? `${prefix}${line}` : prefix.trimEnd();
    })
    .join('\n');
}

/**
 * Returns the text separating two consecutive blocks.
 *
 * Blocks in a tight list sit on consecutive lines, everything else is
 * separated by a blank line. A blank line inside a container still carries
 * that container's prefix.
 *
 * @param previous - The preceding block.
 * @param element - The block being serialized.
 * @param numbers - The displayed number of each ordered item frame.
 * @returns The separator.
 */
function resolveSeparator(
  previous: Element,
  element: Element,
  numbers: Map<string, number>,
): string {
  // Tight list blocks are not separated by a blank line
  if (isTight(previous.ancestry, element.ancestry)) {
    return '\n';
  }

  const sharedDepth = resolveSharedFrameDepth(
    previous.ancestry,
    element.ancestry,
  );
  const shared = (element.ancestry || []).slice(0, sharedDepth);
  // The blank line belongs to the containers both blocks are inside, so it
  // carries their continuation prefix
  const blankLine = resolveAncestryPrefixes(
    shared,
    shared,
    numbers,
  ).continuation.trimEnd();

  return `\n${blankLine}\n`;
}

/**
 * Determines whether two consecutive blocks belong to a tight list, meaning
 * no blank line separates them.
 *
 * @param ancestry - The preceding block's ancestry.
 * @param nextAncestry - The following block's ancestry.
 * @returns Whether the blocks are tight.
 */
function isTight(ancestry: Frame[] = [], nextAncestry: Frame[] = []): boolean {
  const depth = resolveSharedFrameDepth(ancestry, nextAncestry);
  const frame = ancestry[depth];
  const nextFrame = nextAncestry[depth];

  // Both blocks sit directly inside the same innermost container
  if (!frame && !nextFrame) {
    const item = resolveInnermostListItem(ancestry);

    return !!item && !item.spread;
  }

  // One block nests inside a container the other is not in, which only
  // keeps them together when they are already inside a shared container
  if (!frame || !nextFrame) {
    const nested = frame || nextFrame;

    return depth > 0 && nested.kind === 'list-item' && !nested.spread;
  }

  // The blocks are in sibling containers, which are only tight when they are
  // items of the same list
  return (
    frame.kind === 'list-item' &&
    nextFrame.kind === 'list-item' &&
    isSameList(frame, nextFrame) &&
    !frame.spread &&
    !nextFrame.spread
  );
}
