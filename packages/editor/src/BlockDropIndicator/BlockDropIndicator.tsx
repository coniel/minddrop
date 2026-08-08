import React from 'react';
import { BlockDropPosition } from '../useBlockDrag';
import './BlockDropIndicator.css';

export interface BlockDropIndicatorProps {
  /**
   * The position the dragged blocks would drop into. When null,
   * nothing is rendered.
   */
  position: BlockDropPosition | null;
}

/**
 * Renders the line marking where dragged blocks would drop.
 *
 * Rendered within the editor's container rather than portalled out
 * of it like the gutter, the indicator belonging to the content
 * rather than to the margin beside it.
 */
export const BlockDropIndicator: React.FC<BlockDropIndicatorProps> = ({
  position,
}) => {
  // No blocks are being dragged over the editor
  if (!position) {
    return null;
  }

  return (
    <div
      className="editor-block-drop-indicator"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    />
  );
};
