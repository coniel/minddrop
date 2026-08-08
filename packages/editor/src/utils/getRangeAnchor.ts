import { Range as SlateRange } from 'slate';
import { ReactEditor } from 'slate-react';
import { Editor } from '../types';

export interface RangeAnchor {
  /**
   * The on screen rect of the range's text.
   */
  rect: DOMRect;

  /**
   * The font size of the range's text.
   */
  fontSize: string;

  /**
   * The colour of the range's text.
   */
  color: string;
}

/**
 * Gets the on screen position and styling of a range's text, used
 * to render floating UI in line with it.
 *
 * @param editor An editor instance.
 * @param at The range to measure.
 * @returns The range anchor, or null if the range is not rendered.
 */
export function getRangeAnchor(
  editor: Editor,
  at: SlateRange,
): RangeAnchor | null {
  let domRange: Range;

  try {
    domRange = ReactEditor.toDOMRange(editor, at);
  } catch {
    // The range may point at a node which is not rendered
    return null;
  }

  const rect = domRange.getBoundingClientRect();

  // Text which has not been laid out has no position to report
  if (rect.height === 0) {
    return null;
  }

  const container = domRange.startContainer;
  const element =
    container instanceof HTMLElement ? container : container.parentElement;

  if (!element) {
    return null;
  }

  const style = window.getComputedStyle(element);

  return {
    rect,
    fontSize: style.fontSize,
    color: style.color,
  };
}
