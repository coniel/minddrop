import React, { RefObject, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconButton, propsToClass } from '@minddrop/ui-primitives';
import { HoveredBlock } from '../useHoveredBlock';
import './BlockGutter.css';

export type BlockInsertPosition = 'above' | 'below';

export interface BlockGutterProps {
  /**
   * The block the controls are aligned with. When null, no
   * controls are rendered.
   */
  block: HoveredBlock | null;

  /**
   * Ref attached to the controls, used to keep the hovered block
   * while the pointer is over them.
   */
  controlsRef: RefObject<HTMLDivElement | null>;

  /**
   * Ref attached to the handle, used to position the block actions
   * menu against it.
   */
  handleRef: RefObject<HTMLButtonElement | null>;

  /**
   * Callback fired when the insert button is clicked, with the
   * position of the new block relative to the hovered one.
   */
  onInsert: (position: BlockInsertPosition) => void;

  /**
   * Callback fired when the handle is clicked, with whether the
   * current block selection should be extended to the block.
   */
  onSelect: (extend: boolean) => void;

  /**
   * Callback fired when the handle starts being dragged.
   */
  onDragStart: (event: React.DragEvent) => void;

  /**
   * Callback fired when the handle stops being dragged, whether or
   * not the blocks were dropped anywhere.
   */
  onDragEnd: (event: React.DragEvent) => void;

  /**
   * When true, the controls are faded out without being removed,
   * which dragging them relies on.
   */
  hidden?: boolean;
}

/**
 * Renders the controls acting on the hovered block, floating in
 * the margin alongside it.
 *
 * Rendered in a portal and positioned against the viewport, since
 * the editor is often rendered inside a container which clips its
 * overflow, such as a card.
 */
export const BlockGutter: React.FC<BlockGutterProps> = ({
  block,
  controlsRef,
  handleRef,
  onInsert,
  onSelect,
  onDragStart,
  onDragEnd,
  hidden = false,
}) => {
  // The controls sit outside the editable area, so their events
  // are not stopped by it and would otherwise reach the handlers
  // of whatever the editor is rendered in.
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  // Keeps the cursor in the editor rather than moving it to the
  // button. Not done for the handle, where preventing the default
  // mouse down action would stop it ever starting a drag.
  const handleInsertMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  // Holding shift inserts above the hovered block rather than below it
  const handleInsertClick = useCallback(
    (event: React.MouseEvent) => {
      onInsert(event.shiftKey ? 'above' : 'below');
    },
    [onInsert],
  );

  // Holding shift extends the block selection to the block rather
  // than selecting it on its own
  const handleSelectClick = useCallback(
    (event: React.MouseEvent) => {
      onSelect(event.shiftKey);
    },
    [onSelect],
  );

  // Nothing to align the controls with
  if (!block) {
    return null;
  }

  return createPortal(
    <div
      ref={controlsRef}
      className={propsToClass('editor-block-gutter', { hidden })}
      style={{ top: block.top, left: block.left, height: block.lineHeight }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* Filled so that the controls read as floating above
          whatever sits beside an editor with no margin of its own */}
      <IconButton
        icon="plus"
        size="sm"
        variant="filled"
        label="editor.blockGutter.insert"
        onMouseDown={handleInsertMouseDown}
        onClick={handleInsertClick}
      />

      <IconButton
        draggable
        ref={handleRef}
        className="editor-block-gutter-handle"
        icon="grip-vertical"
        size="sm"
        variant="filled"
        label="editor.blockGutter.select"
        onClick={handleSelectClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </div>,
    document.body,
  );
};
