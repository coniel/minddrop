import React, { FC } from 'react';
import { IconButton } from '@minddrop/ui-primitives';

interface ViewAreaPaneProps {
  /**
   * The content to render inside the pane.
   */
  children: React.ReactNode;

  /**
   * Which side of the split this pane is on.
   */
  position: 'left' | 'right';

  /**
   * Called when the pane's close button is clicked.
   */
  onClose: () => void;

  /**
   * Called when the swap button is clicked.
   */
  onSwap: () => void;

  /**
   * Inline styles applied to the pane container, used for dynamic
   * flex sizing.
   */
  style?: React.CSSProperties;
}

/**
 * Wraps split view content with swap and close buttons.
 */
export const ViewAreaPane: FC<ViewAreaPaneProps> = ({
  children,
  position,
  onClose,
  onSwap,
  style,
}) => (
  <div className="view-area-pane" style={style}>
    <div className="view-area-pane-header">
      <IconButton
        icon={position === 'left' ? 'arrow-right' : 'arrow-left'}
        label="actions.swapSplitPosition"
        onClick={onSwap}
        size="sm"
      />
      <IconButton icon="x" label="actions.close" onClick={onClose} size="sm" />
    </div>
    {children}
  </div>
);
