import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Path, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { Element } from '@minddrop/ast';
import { useDraggable } from '@minddrop/selection';
import { moveBlocksTo } from '../moveBlocksTo';
import { selectBlocks } from '../selectBlocks';
import {
  BLOCK_SELECTION_ITEM_TYPE,
  BlockSelectionItem,
  Editor,
} from '../types';
import { HoveredBlock } from '../useHoveredBlock';
import {
  getBlockDropIndex,
  getBlockFromDomNode,
  getContentStartIndex,
  getSelectedBlocks,
  hasBlockId,
} from '../utils';

export interface BlockDropPosition {
  /**
   * The indicator's distance from the top of the editor container,
   * in pixels.
   */
  top: number;

  /**
   * The indicator's distance from the left of the editor container,
   * in pixels.
   */
  left: number;

  /**
   * The width of the block the indicator is aligned with, in pixels.
   */
  width: number;
}

export interface UseBlockDrag {
  /**
   * The position of the drop indicator, or null when no block is
   * being dragged over the editor.
   */
  dropIndicator: BlockDropPosition | null;

  /**
   * Whether blocks are being dragged out of the editor.
   */
  isDragging: boolean;

  /**
   * Drag start handler for the hovered block's handle.
   */
  handleDragStart: (event: React.DragEvent) => void;

  /**
   * Dragover handler for the editable area, which moves the drop
   * indicator. Returns whether the event was consumed.
   */
  handleDragOver: (event: React.DragEvent) => boolean;

  /**
   * Drop handler for the editable area, which moves the dragged
   * blocks. Returns whether the event was consumed.
   */
  handleDrop: (event: React.DragEvent) => boolean;

  /**
   * Drag end handler for the block being dragged, which drops the
   * drag whether or not it ended in a move.
   */
  handleDragEnd: (event: React.DragEvent) => void;
}

/**
 * Drags blocks to reorder them, using native drag and drop.
 *
 * The drag goes through the app's selection, so that the blocks can
 * be dropped on anything in the app which accepts them, rather than
 * only back into the editor they came from.
 *
 * The dragover and drop handlers are passed to Slate's `Editable`,
 * which skips its own handling of an event when the handler it was
 * given reports having consumed it. Events belonging to any other
 * drag, such as dragging selected text, are declined and left to
 * Slate.
 *
 * @param editor An editor instance.
 * @param containerRef A ref to the element containing the editor.
 * @param hoveredBlock The block whose handle a drag would start from.
 * @param enabled Whether blocks can be dragged.
 * @returns The drag handlers and the drop indicator's position.
 */
export function useBlockDrag(
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
  hoveredBlock: HoveredBlock | null,
  enabled: boolean,
): UseBlockDrag {
  const [dropIndicator, setDropIndicator] = useState<BlockDropPosition | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  // The blocks being dragged, held outside of state because their
  // paths are only read when the drag ends
  const draggedPathsRef = useRef<Path[] | null>(null);

  // The insertion point the indicator marks, also used to leave the
  // indicator alone while it is unchanged. Dragover fires
  // continuously, and measuring on every event is enough to make
  // the drag stutter.
  const dropIndexRef = useRef<number | null>(null);

  // The hovered block as the app's selection knows it. Blocks with
  // no ID cannot be selected, and so cannot be dragged.
  const draggedItem = useMemo<BlockSelectionItem>(() => {
    const blockId =
      hoveredBlock && hasBlockId(hoveredBlock.element)
        ? hoveredBlock.element.id
        : '';

    return {
      id: blockId,
      type: BLOCK_SELECTION_ITEM_TYPE,
      data: { editor, blockId },
    };
  }, [editor, hoveredBlock]);

  const { onDragStart: startSelectionDrag, onDragEnd: endSelectionDrag } =
    useDraggable(draggedItem);

  const clearDropTarget = useCallback(() => {
    draggedPathsRef.current = null;
    dropIndexRef.current = null;

    setDropIndicator(null);
  }, []);

  // The drag itself only ends on dragend, which fires after the
  // drop. Showing the controls again on the drop would flash them
  // up against where the dragged block used to be.
  const endBlockDrag = useCallback(() => {
    clearDropTarget();

    setIsDragging(false);
  }, [clearDropTarget]);

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (!enabled || !hoveredBlock) {
        return;
      }

      const isSelected = getSelectedBlocks(editor).some(
        ([, path]) => path[0] === hoveredBlock.path[0],
      );

      // Dragging a block outside the block selection drags it on
      // its own, and dragging one within it drags all of it
      if (!isSelected) {
        selectBlocks(editor, hoveredBlock.path, hoveredBlock.path);
      }

      const paths = getSelectedBlocks(editor).map(([, path]) => path);

      // The blocks may no longer be in the document
      if (!paths.length) {
        return;
      }

      draggedPathsRef.current = paths;

      event.dataTransfer.effectAllowed = 'move';

      // Serializes the selection onto the drag, which is what lets
      // the blocks be dropped outside the editor
      startSelectionDrag(event);

      const block = editor.children[paths[0][0]];
      const domNode = SlateElement.isElement(block)
        ? getBlockDomNode(editor, block)
        : null;

      // Dragging the block itself rather than the handle it was
      // picked up by
      if (domNode) {
        event.dataTransfer.setDragImage(domNode, 0, 0);
      }

      // Set once the drag has been fully set up, the drag image
      // among it, which fading the controls out must not disturb
      setIsDragging(true);
    },
    [editor, enabled, hoveredBlock, startSelectionDrag],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      const container = containerRef.current;

      // Any other drag, such as of selected text, is Slate's to
      // handle
      if (!draggedPathsRef.current || !container) {
        return false;
      }

      // Marks the editor as a place the blocks can be dropped
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      const index = resolveDropIndex(editor, event);

      if (index === null) {
        return true;
      }

      // Already marking this insertion point
      if (dropIndexRef.current === index) {
        return true;
      }

      dropIndexRef.current = index;

      setDropIndicator(measureDropPosition(editor, container, index));

      return true;
    },
    [editor, containerRef],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const paths = draggedPathsRef.current;
      const index = dropIndexRef.current;

      if (!paths) {
        return false;
      }

      event.preventDefault();

      clearDropTarget();

      if (index !== null) {
        moveBlocksTo(editor, paths, index);
      }

      return true;
    },
    [editor, clearDropTarget],
  );

  const handleDragEnd = useCallback(
    (event: React.DragEvent) => {
      endBlockDrag();
      endSelectionDrag(event);
    },
    [endBlockDrag, endSelectionDrag],
  );

  return {
    dropIndicator,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}

/**
 * Resolves the insertion point under the pointer.
 *
 * @param editor An editor instance.
 * @param event A dragover event.
 * @returns The insertion index, or null if the pointer is not over a block.
 */
function resolveDropIndex(
  editor: Editor,
  event: React.DragEvent,
): number | null {
  const block = getBlockFromDomNode(editor, event.target as Node);

  if (!block) {
    return null;
  }

  return getBlockDropIndex(
    block.path[0],
    block.domNode.getBoundingClientRect(),
    event.clientY,
    getContentStartIndex(editor),
  );
}

/**
 * Measures where the indicator for an insertion point sits within
 * the editor's container.
 *
 * Taken from the insertion point rather than from the block being
 * dragged over, so that both of the blocks either side of a gap
 * mark it in the same place rather than each against their own
 * edge.
 *
 * @param editor An editor instance.
 * @param container The element containing the editor.
 * @param index The insertion index.
 * @returns The indicator's position, or null if neither neighbouring block is rendered.
 */
function measureDropPosition(
  editor: Editor,
  container: HTMLElement,
  index: number,
): BlockDropPosition | null {
  const blockAboveRect = getBlockRect(editor, index - 1);
  const blockBelowRect = getBlockRect(editor, index);

  // The blocks either side of the insertion point decide where it
  // sits, which at the ends of the document is only one of them
  const alignedRect = blockBelowRect ?? blockAboveRect;

  if (!alignedRect) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();

  return {
    top: getGapCentre(blockAboveRect, blockBelowRect) - containerRect.top,
    left: alignedRect.left - containerRect.left,
    width: alignedRect.width,
  };
}

/**
 * Gets the point between two blocks, or the near edge of whichever
 * of them there is.
 *
 * @param blockAboveRect The bounds of the block above the gap.
 * @param blockBelowRect The bounds of the block below the gap.
 * @returns The gap's centre, in pixels from the top of the viewport.
 */
function getGapCentre(
  blockAboveRect: DOMRect | null,
  blockBelowRect: DOMRect | null,
): number {
  if (blockAboveRect && blockBelowRect) {
    return (blockAboveRect.bottom + blockBelowRect.top) / 2;
  }

  if (blockAboveRect) {
    return blockAboveRect.bottom;
  }

  return blockBelowRect ? blockBelowRect.top : 0;
}

/**
 * Measures the top level block at the given index.
 *
 * @param editor An editor instance.
 * @param index The index of the block.
 * @returns The block's bounds, or null if there is no block rendered there.
 */
function getBlockRect(editor: Editor, index: number): DOMRect | null {
  const block = index >= 0 ? editor.children[index] : undefined;

  if (!block || !SlateElement.isElement(block)) {
    return null;
  }

  const domNode = getBlockDomNode(editor, block);

  return domNode ? domNode.getBoundingClientRect() : null;
}

/**
 * Gets the DOM node rendering a block.
 *
 * @param editor An editor instance.
 * @param element The block element.
 * @returns The block's DOM node, or null if it is not rendered.
 */
function getBlockDomNode(editor: Editor, element: Element): HTMLElement | null {
  try {
    return ReactEditor.toDOMNode(editor, element);
  } catch {
    return null;
  }
}
