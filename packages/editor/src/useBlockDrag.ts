import {
  RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Path, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { Element } from '@minddrop/ast';
import {
  DragMoveData,
  DraggableProps,
  DroppableProps,
} from '@minddrop/drag-and-drop';
import { DropEventData, Selection } from '@minddrop/selection';
import { insertBlocksAt } from './insertBlocksAt';
import { moveBlocksTo } from './moveBlocksTo';
import { selectBlocks } from './selectBlocks';
import { BLOCK_SELECTION_ITEM_TYPE, BlockSelectionItem, Editor } from './types';
import { HoveredBlock } from './useHoveredBlock';
import {
  getBlockDropIndex,
  getBlockFromDomNode,
  getContentStartIndex,
  getSelectedBlocks,
  hasBlockId,
} from './utils';

// The drag data types an editor takes drops of
const ACCEPTED_DATA_TYPES = [BLOCK_SELECTION_ITEM_TYPE];

// A disabled editor takes drops of nothing
const NO_DATA_TYPES: string[] = [];

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
   * Props making the hovered block's handle the drag's handle.
   */
  dragHandleProps: DraggableProps;

  /**
   * Props making the editor's container a drop target for blocks.
   */
  droppableProps: DroppableProps;
}

/**
 * Drags blocks to reorder them.
 *
 * The drag goes through the app's selection, so that the blocks can
 * be dropped on anything in the app which accepts them, rather than
 * only back into the editor they came from.
 *
 * Blocks dragged from another editor are accepted as well, arriving
 * as a move: dropping them inserts them at the indicator and removes
 * them from the editor they were dragged out of.
 *
 * @param editor - An editor instance.
 * @param containerRef - A ref to the element containing the editor.
 * @param hoveredBlock - The block whose handle a drag would start from.
 * @param enabled - Whether blocks can be dragged.
 * @returns The drag props and the drop indicator's position.
 */
export function useBlockDrag(
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
  hoveredBlock: HoveredBlock | null,
  enabled: boolean,
): UseBlockDrag {
  const editorId = useId();
  const [dropIndicator, setDropIndicator] = useState<BlockDropPosition | null>(
    null,
  );

  // The blocks being dragged, held outside of state because their
  // paths are only read when the drag ends.
  const draggedPathsRef = useRef<Path[] | null>(null);

  // The insertion point the indicator marks, also used to leave the
  // indicator alone while it is unchanged. Moves fire continuously,
  // and measuring on every one is enough to make the drag stutter.
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

  // Where a drag out of this editor starts from. A drop reads it to
  // tell a drag from this editor apart from one from another.
  const origin = useMemo(() => ({ type: 'editor', id: editorId }), [editorId]);

  // Select the blocks the drag takes as it starts. A block outside
  // the block selection is dragged on its own, one within it drags
  // all of it.
  const handleActivate = useCallback(() => {
    if (!hoveredBlock) {
      return;
    }

    // Check if the hovered block is in the block selection
    const isSelected = getSelectedBlocks(editor).some(
      ([, path]) => path[0] === hoveredBlock.path[0],
    );

    // Check if the block is outside the selection. If so, select it
    // on its own.
    if (!isSelected) {
      selectBlocks(editor, hoveredBlock.path, hoveredBlock.path);
    }

    // Remember the dragged blocks' paths
    draggedPathsRef.current = getSelectedBlocks(editor).map(([, path]) => path);
  }, [editor, hoveredBlock]);

  // Resolve the first dragged block's element as the preview, rather
  // than the handle it was picked up by.
  const resolvePreview = useCallback(() => {
    // Read the dragged paths
    const paths = draggedPathsRef.current;

    if (!paths || !paths.length) {
      return null;
    }

    // Read the first dragged block
    const block = editor.children[paths[0][0]];

    // Return the block's DOM node
    return SlateElement.isElement(block)
      ? getBlockDomNode(editor, block)
      : null;
  }, [editor]);

  // Make the hovered block draggable by its handle
  const { draggableProps, isDragging } = Selection.useDraggable(draggedItem, {
    origin,
    preview: resolvePreview,
    disabled: !enabled || draggedItem.id === '',
    onActivate: handleActivate,
  });

  // Hide the indicator without ending the drag
  const clearDropIndicator = useCallback(() => {
    // Forget the insertion point
    dropIndexRef.current = null;

    // Hide the indicator
    setDropIndicator(null);
  }, []);

  // Move the indicator to the insertion point under the pointer
  const handleDragMove = useCallback(
    (move: DragMoveData) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      // Resolve the insertion point under the pointer
      const index = resolveDropIndex(editor, move.target, move.clientY);

      // Check if the pointer is over a block and the insertion point
      // changed. If not, leave the indicator as it is.
      if (index === null || dropIndexRef.current === index) {
        return;
      }

      // Remember the insertion point
      dropIndexRef.current = index;

      // Measure the indicator's position and show it
      setDropIndicator(measureDropPosition(editor, container, index));
    },
    [editor, containerRef],
  );

  // Move or insert the dropped blocks at the insertion point
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      // Read the dragged paths and the insertion point
      const paths = draggedPathsRef.current;
      const index = dropIndexRef.current;

      // Hide the indicator
      clearDropIndicator();

      if (index === null) {
        return;
      }

      // Check if the blocks were dragged from this editor. If so,
      // move them within it.
      if (drop.origin?.id === editorId) {
        if (paths) {
          moveBlocksTo(editor, paths, index);
        }

        return;
      }

      // Read the dragged blocks' elements off the drag's data
      const data = drop.data as Partial<
        Record<typeof BLOCK_SELECTION_ITEM_TYPE, Element[]>
      >;
      const elements = data[BLOCK_SELECTION_ITEM_TYPE];

      if (!elements || !elements.length) {
        return;
      }

      // Delete the dragged blocks from the editor they came from.
      // They are the app's selection, selected as the drag began.
      Selection.delete();

      // Focus the editor before the insertion, since Slate defers
      // focus while operations are pending. The selection over the
      // inserted blocks needs the DOM focus.
      ReactEditor.focus(editor);

      // Insert the blocks at the insertion point
      insertBlocksAt(editor, elements, index);
    },
    [editor, editorId, clearDropIndicator],
  );

  // Make the editor's container a drop target for blocks
  const { droppableProps, isDraggingOver } = Selection.useDroppable({
    type: 'editor',
    id: editorId,
    accepts: enabled ? ACCEPTED_DATA_TYPES : NO_DATA_TYPES,
    onDragMove: handleDragMove,
    onDrop: handleDrop,
  });

  // Hide the indicator when the drag moves off the editor or ends
  // elsewhere, since it only follows moves over the editor.
  useEffect(() => {
    if (!isDraggingOver) {
      clearDropIndicator();
    }
  }, [isDraggingOver, clearDropIndicator]);

  // Forget the dragged paths once the drag ends
  useEffect(() => {
    if (!isDragging) {
      draggedPathsRef.current = null;
    }
  }, [isDragging]);

  return {
    dropIndicator,
    isDragging,
    dragHandleProps: draggableProps,
    droppableProps,
  };
}

/**
 * Resolves the insertion point under the pointer.
 *
 * @param editor - An editor instance.
 * @param target - The element under the pointer.
 * @param clientY - The pointer's distance from the top of the viewport.
 * @returns The insertion index, or null if the pointer is not over a block.
 */
function resolveDropIndex(
  editor: Editor,
  target: Node,
  clientY: number,
): number | null {
  // Find the block under the pointer
  const block = getBlockFromDomNode(editor, target);

  if (!block) {
    return null;
  }

  // Resolve the insertion index from the pointer's position over the
  // block.
  return getBlockDropIndex(
    block.path[0],
    block.domNode.getBoundingClientRect(),
    clientY,
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
  const blockAboveRect = resolveBlockRect(editor, index - 1);
  const blockBelowRect = resolveBlockRect(editor, index);

  // The blocks either side of the insertion point decide where it
  // sits, which at the ends of the document is only one of them.
  const alignedRect = blockBelowRect ?? blockAboveRect;

  if (!alignedRect) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();

  return {
    top: resolveGapCentre(blockAboveRect, blockBelowRect) - containerRect.top,
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
function resolveGapCentre(
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
function resolveBlockRect(editor: Editor, index: number): DOMRect | null {
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
