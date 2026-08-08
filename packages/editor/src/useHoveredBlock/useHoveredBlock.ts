import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Path } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from '../types';
import { getBlockFromDomNode } from '../utils';
import { TITLE_ELEMENT_TYPE } from '../withTitle';

// Used when a block's line height cannot be measured
const FALLBACK_LINE_HEIGHT = 24;

export interface HoveredBlock {
  /**
   * The hovered top level block element.
   */
  element: Element;

  /**
   * The path of the hovered block.
   */
  path: Path;

  /**
   * The block's distance from the top of the viewport, in pixels.
   */
  top: number;

  /**
   * The block's distance from the left of the viewport, in pixels.
   */
  left: number;

  /**
   * The height of the block's first line, in pixels, used to align
   * controls with the block's first line rather than its centre.
   */
  lineHeight: number;
}

export interface UseHoveredBlock {
  /**
   * The block under the pointer, or null if no block is hovered.
   */
  hoveredBlock: HoveredBlock | null;

  /**
   * Drops the hovered block, used after acting on it. The block is
   * picked up again once the pointer next moves.
   */
  clearHoveredBlock: () => void;
}

/**
 * Tracks the block element under the pointer, along with its
 * position in the viewport, used to render block controls
 * alongside it.
 *
 * Positions are relative to the viewport because the controls are
 * rendered in a portal, which keeps them clear of any ancestor
 * clipping the editor.
 *
 * The hovered block is kept while the pointer is between blocks or
 * over the controls. It is dropped once the pointer leaves both, as
 * well as on typing and scrolling, both of which move the content
 * out from under the measured position.
 *
 * @param editor An editor instance.
 * @param containerRef A ref to the element containing the editor.
 * @param controlsRef A ref to the element containing the block controls.
 * @param enabled Whether to track the hovered block.
 * @returns The hovered block and a callback which drops it.
 */
export function useHoveredBlock(
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
  controlsRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): UseHoveredBlock {
  const [hoveredBlock, setHoveredBlock] = useState<HoveredBlock | null>(null);

  // The DOM node the current position was measured from, used to
  // recognise the pointer still being over the same block. Measuring
  // forces a layout, so it has to happen only when the block
  // actually changes rather than on every pointer move.
  const measuredNodeRef = useRef<HTMLElement | null>(null);

  const clearHoveredBlock = useCallback(() => {
    measuredNodeRef.current = null;

    setHoveredBlock(null);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const container = containerRef.current;
      const target = event.target as Node | null;

      if (!container || !target) {
        return;
      }

      // The controls sit outside the editor, so keep the block
      // they belong to while the pointer is over them.
      if (controlsRef.current?.contains(target)) {
        return;
      }

      // A held button means a selection is being dragged, which the
      // controls play no part in.
      if (event.buttons !== 0) {
        clearHoveredBlock();

        return;
      }

      // Still over the block the controls already point at, which
      // the rest of the work would only arrive back at.
      if (measuredNodeRef.current?.contains(target)) {
        return;
      }

      // Stop tracking once the pointer is elsewhere on the page
      if (!container.contains(target)) {
        clearHoveredBlock();

        return;
      }

      const block = getBlockFromDomNode(editor, target);

      // Keep the current block when the pointer is within the
      // editor but not over a block, such as between two of them.
      if (!block) {
        return;
      }

      // The title is not a content block
      if (block.element.type === TITLE_ELEMENT_TYPE) {
        clearHoveredBlock();

        return;
      }

      const blockRect = block.domNode.getBoundingClientRect();

      measuredNodeRef.current = block.domNode;

      setHoveredBlock({
        element: block.element,
        path: block.path,
        top: blockRect.top,
        left: blockRect.left,
        lineHeight: getLineHeight(block.domNode),
      });
    },
    [editor, containerRef, controlsRef, clearHoveredBlock],
  );

  // Stop tracking when disabled, e.g. in a read-only editor
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !enabled) {
      setHoveredBlock(null);

      return;
    }

    // Tracked on the document rather than the editor so that the
    // pointer moving onto the portalled controls, or away from the
    // editor entirely, is seen.
    document.addEventListener('pointermove', handlePointerMove);

    // Typing and scrolling both move the content out from under the
    // measured position, and neither is a moment to be offering
    // controls for a block the pointer happens to rest on.
    //
    // Key presses are listened for on the container rather than the
    // document because the editor stops them propagating any
    // further, to keep them clear of the handlers around it.
    container.addEventListener('keydown', clearHoveredBlock);
    window.addEventListener('scroll', clearHoveredBlock, true);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('keydown', clearHoveredBlock);
      window.removeEventListener('scroll', clearHoveredBlock, true);
    };
  }, [containerRef, enabled, handlePointerMove, clearHoveredBlock]);

  return {
    hoveredBlock: enabled ? hoveredBlock : null,
    clearHoveredBlock,
  };
}

/**
 * Gets the height of a block's line of text.
 *
 * @param domNode The DOM node rendering the block.
 * @returns The line height in pixels.
 */
function getLineHeight(domNode: HTMLElement): number {
  const lineHeight = parseFloat(window.getComputedStyle(domNode).lineHeight);

  // A line height of 'normal' does not parse into a number
  if (Number.isNaN(lineHeight)) {
    return FALLBACK_LINE_HEIGHT;
  }

  return lineHeight;
}
