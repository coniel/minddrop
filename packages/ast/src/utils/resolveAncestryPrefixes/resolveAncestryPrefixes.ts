import { Frame, ListItemFrame } from '../../types';

export interface AncestryPrefixes {
  /**
   * The prefix for the block's first line.
   */
  first: string;

  /**
   * The prefix for the block's remaining lines.
   */
  continuation: string;
}

const BlockquotePrefix = '> ';
const FootnoteContinuationPrefix = '    ';

/**
 * Composes the line prefixes a block's containers contribute, outermost
 * first.
 *
 * A container's marker is only drawn on the first block inside it, so the
 * previous block's ancestry decides whether each frame contributes its
 * marker or the equivalent whitespace.
 *
 * @param ancestry - The block's ancestry.
 * @param previousAncestry - The preceding block's ancestry.
 * @param numbers - The displayed number of each ordered item frame.
 * @returns The block's line prefixes.
 */
export function resolveAncestryPrefixes(
  ancestry: Frame[] = [],
  previousAncestry: Frame[] = [],
  numbers: Map<string, number> = new Map(),
): AncestryPrefixes {
  const openFrames = new Set(previousAncestry.map((frame) => frame.id));
  let first = '';
  let continuation = '';

  ancestry.forEach((frame) => {
    const prefixes = resolveFramePrefixes(frame, numbers);
    // A frame the previous block was already inside draws no marker
    const isFrameStart = !openFrames.has(frame.id);

    first += isFrameStart ? prefixes.first : prefixes.continuation;
    continuation += prefixes.continuation;
  });

  return { first, continuation };
}

/**
 * Returns the prefixes a single frame contributes.
 *
 * @param frame - The frame.
 * @param numbers - The displayed number of each ordered item frame.
 * @returns The frame's line prefixes.
 */
function resolveFramePrefixes(
  frame: Frame,
  numbers: Map<string, number>,
): AncestryPrefixes {
  // A quote marks every one of its lines, so both prefixes are the same
  if (frame.kind === 'blockquote') {
    const prefix = frame.syntax || BlockquotePrefix;

    return { first: prefix, continuation: prefix };
  }

  // A footnote definition's label opens it, and its content is indented
  if (frame.kind === 'footnote-definition') {
    return {
      first: `[^${frame.label || frame.identifier}]: `,
      continuation: FootnoteContinuationPrefix,
    };
  }

  const indent = frame.indent || '';
  // The number the author wrote wins over the computed one, since only the
  // list's first number changes how it renders and rewriting the rest would
  // edit a file the user did not touch. Computed numbering fills in for
  // items which were never authored, such as ones typed in the editor.
  const marker = frame.ordered
    ? `${frame.number ?? numbers.get(frame.id) ?? 1}${frame.marker}`
    : frame.marker;

  return {
    first: `${indent}${marker} ${resolveTaskBox(frame)}`,
    // Continuation lines align with the item's content rather than its
    // marker, so the marker is replaced by its own width in spaces
    continuation: `${indent}${' '.repeat(marker.length + 1)}`,
  };
}

/**
 * Returns the task list checkbox for an item's checked state, spelled as
 * the author wrote it where that is known.
 *
 * @param frame - The item's frame.
 * @returns The checkbox, or an empty string for a plain item.
 */
function resolveTaskBox(frame: ListItemFrame): string {
  if (frame.checked === undefined) {
    return '';
  }

  if (frame.checkedSyntax) {
    return `[${frame.checkedSyntax}] `;
  }

  return frame.checked ? '[x] ' : '[ ] ';
}
