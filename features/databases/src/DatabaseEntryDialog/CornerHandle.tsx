import React from 'react';

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// SVG arc path data for each corner
const cornerPaths: Record<Corner, string> = {
  'top-left': 'M 25 0 A 25 25 0 0 0 0 25',
  'top-right': 'M 0 0 A 25 25 0 0 1 25 25',
  'bottom-left': 'M 25 25 A 25 25 0 0 1 0 0',
  'bottom-right': 'M 0 25 A 25 25 0 0 0 25 0',
};

export interface CornerHandleProps {
  /**
   * Which corner of the canvas this handle sits in.
   */
  corner: Corner;

  /**
   * Callback fired on mousedown to start a resize.
   */
  onMouseDown: (event: React.MouseEvent) => void;
}

/**
 * SVG arc corner handle for resizing the canvas diagonally.
 */
export const CornerHandle: React.FC<CornerHandleProps> = ({
  corner,
  onMouseDown,
}) => (
  <div
    className={`entry-dialog-resize-handle entry-dialog-resize-handle-${corner}`}
    onMouseDown={onMouseDown}
  >
    <svg width="25" height="25" overflow="visible">
      <path
        d={cornerPaths[corner]}
        fill="none"
        stroke="var(--neutral-400)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
