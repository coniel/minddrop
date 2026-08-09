import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Path } from 'slate';
import { Element } from '@minddrop/ast';
import { Editor } from '../types';
import { getBlockFromDomNode } from '../utils';
import { TITLE_ELEMENT_TYPE } from '../withTitle';

// Used when a block's line height cannot be measured
const FALLBACK_LINE_HEIGHT = 24;

// How long the pointer must stay inside the editor before blocks
// are exposed, keeping the controls from flashing up while the
// pointer merely passes over the editor
export const ACTIVATION_DELAY = 700;

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
   * The distance from the top of the viewport to the top of the
   * block's first line of text, in pixels. Sits below the block's
   * own edge when the block is spaced with top padding.
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
   * The block under the pointer, or null if no block is hovered or
   * the activation delay has not yet passed.
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
 * Blocks are only exposed once the pointer has rested inside the
 * editor for a moment, so that the controls do not flash up on
 * every editor the pointer passes over. Once past the delay,
 * tracking is instant until the pointer leaves the editor.
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

  // Whether the activation delay has passed. Blocks are tracked
  // regardless, but only exposed once active, so that a block the
  // pointer is resting on appears the moment the delay runs out.
  const [active, setActive] = useState(false);

  // The pending activation timer, if the delay is counting down
  const activationTimerRef = useRef<number | null>(null);

  // The DOM node the current position was measured from, used to
  // recognise the pointer still being over the same block. Measuring
  // forces a layout, so it has to happen only when the block
  // actually changes rather than on every pointer move.
  const measuredNodeRef = useRef<HTMLElement | null>(null);

  // Whether the pointer was pressed on the controls, which means a
  // drag is being started from them
  const pressedControlsRef = useRef(false);

  const clearHoveredBlock = useCallback(() => {
    measuredNodeRef.current = null;

    setHoveredBlock(null);
  }, []);

  // Begins counting down to activation, unless already active or
  // already counting
  const startActivation = useCallback(() => {
    // Nothing to do once active or while a countdown is pending
    if (active || activationTimerRef.current !== null) {
      return;
    }

    // Activate once the delay has passed
    activationTimerRef.current = window.setTimeout(() => {
      activationTimerRef.current = null;

      setActive(true);
    }, ACTIVATION_DELAY);
  }, [active]);

  // Deactivates and stops any pending countdown, so that the next
  // visit to the editor waits out the delay again
  const cancelActivation = useCallback(() => {
    // Stop a pending countdown
    if (activationTimerRef.current !== null) {
      window.clearTimeout(activationTimerRef.current);
      activationTimerRef.current = null;
    }

    setActive(false);
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      pressedControlsRef.current = !!controlsRef.current?.contains(
        event.target as Node,
      );
    },
    [controlsRef],
  );

  const releaseControls = useCallback(() => {
    pressedControlsRef.current = false;
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

      // A press which began on the controls is dragging the block
      // they belong to. Dropping the block would unmount the
      // controls, and removing a drag's source element part way
      // through aborts the drag.
      if (pressedControlsRef.current) {
        return;
      }

      // A held button means a selection is being dragged, which the
      // controls play no part in.
      if (event.buttons !== 0) {
        clearHoveredBlock();

        return;
      }

      // Stop tracking once the pointer is elsewhere on the page.
      // Leaving also deactivates, so the next visit to the editor
      // waits out the activation delay again.
      if (!container.contains(target)) {
        cancelActivation();
        clearHoveredBlock();

        return;
      }

      // The pointer is inside the editor, so begin counting down to
      // activation
      startActivation();

      // Still over the block the controls already point at, which
      // the rest of the work would only arrive back at.
      if (measuredNodeRef.current?.contains(target)) {
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
      const blockStyle = window.getComputedStyle(block.domNode);

      measuredNodeRef.current = block.domNode;

      setHoveredBlock({
        element: block.element,
        path: block.path,
        // Offset past any top padding and border, which sit within
        // the block's bounds above its first line of text
        top: blockRect.top + getContentOffsetTop(blockStyle),
        left: blockRect.left,
        lineHeight: getLineHeight(blockStyle),
      });
    },
    [
      editor,
      containerRef,
      controlsRef,
      clearHoveredBlock,
      startActivation,
      cancelActivation,
    ],
  );

  // Stop tracking when disabled, e.g. in a read-only editor
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !enabled) {
      cancelActivation();
      setHoveredBlock(null);

      return;
    }

    // Tracked on the document rather than the editor so that the
    // pointer moving onto the portalled controls, or away from the
    // editor entirely, is seen.
    document.addEventListener('pointermove', handlePointerMove);

    // A drag started from the controls has to outlive the pointer
    // press which began it, and ends with the drag rather than with
    // the press, which a drag swallows.
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', releaseControls);
    document.addEventListener('dragend', releaseControls);

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
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', releaseControls);
      document.removeEventListener('dragend', releaseControls);
      container.removeEventListener('keydown', clearHoveredBlock);
      window.removeEventListener('scroll', clearHoveredBlock, true);
    };
  }, [
    containerRef,
    enabled,
    handlePointerMove,
    handlePointerDown,
    releaseControls,
    clearHoveredBlock,
    cancelActivation,
  ]);

  // Drop any pending activation countdown on unmount
  useEffect(() => {
    return () => {
      if (activationTimerRef.current !== null) {
        window.clearTimeout(activationTimerRef.current);
      }
    };
  }, []);

  return {
    hoveredBlock: enabled && active ? hoveredBlock : null,
    clearHoveredBlock,
  };
}

/**
 * Gets the height of a block's line of text.
 *
 * @param style The computed style of the block's DOM node.
 * @returns The line height in pixels.
 */
function getLineHeight(style: CSSStyleDeclaration): number {
  const lineHeight = parseFloat(style.lineHeight);

  // A line height of 'normal' does not parse into a number
  if (Number.isNaN(lineHeight)) {
    return FALLBACK_LINE_HEIGHT;
  }

  return lineHeight;
}

/**
 * Gets the distance from a block's top edge down to its content,
 * being the space taken up by its top border and padding.
 *
 * @param style The computed style of the block's DOM node.
 * @returns The offset in pixels.
 */
function getContentOffsetTop(style: CSSStyleDeclaration): number {
  const border = parseFloat(style.borderTopWidth);
  const padding = parseFloat(style.paddingTop);

  // Computed values may not resolve to pixel lengths outside a
  // real layout
  return (
    (Number.isNaN(border) ? 0 : border) + (Number.isNaN(padding) ? 0 : padding)
  );
}
