import React, { RefObject, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from '@minddrop/ui-primitives';
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
   * Callback fired when the insert button is clicked, with the
   * position of the new block relative to the hovered one.
   */
  onInsert: (position: BlockInsertPosition) => void;

  /**
   * Callback fired when the handle is clicked, with whether the
   * current block selection should be extended to the block.
   */
  onSelect: (extend: boolean) => void;
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
  onInsert,
  onSelect,
}) => {
  // The controls sit outside the editable area, so their events
  // are not stopped by it and would otherwise reach the handlers
  // of whatever the editor is rendered in.
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();

    // Keep the cursor in the editor, which the insert action needs
    // in order to insert relative to the hovered block
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
      className="editor-block-gutter"
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
        onClick={handleInsertClick}
      />

      <IconButton
        icon="grip-vertical"
        size="sm"
        variant="filled"
        label="editor.blockGutter.select"
        onClick={handleSelectClick}
      />
    </div>,
    document.body,
  );
};
