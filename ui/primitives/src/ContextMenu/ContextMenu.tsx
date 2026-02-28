import { FC } from 'react';
import { MenuContents } from '../types';
import { ContextMenuContent } from './ContextMenuContent';
import { ContextMenuPortal } from './ContextMenuPortal';
import { ContextMenuPositioner } from './ContextMenuPositioner';
import { ContextMenuRoot, ContextMenuRootProps } from './ContextMenuRoot';
import { ContextMenuTrigger } from './ContextMenuTrigger';

/* --- ContextMenu ---
   Convenience wrapper that composes Root + Trigger + Portal +
   Positioner + Content into a single component for the common case. */

export interface ContextMenuProps extends ContextMenuRootProps {
  /**
   * The right-click target region.
   */
  trigger: React.ReactNode;

  /**
   * Minimum width of the menu panel (px).
   */
  minWidth?: number;

  /**
   * Class name applied to the right-click trigger region.
   */
  triggerClassName?: string;

  /**
   * Class name applied to the menu content panel.
   */
  contentClassName?: string;

  /**
   * Declarative content descriptors. Generated alongside children.
   */
  content?: MenuContents;

  /**
   * Menu items rendered inside the content panel.
   */
  children?: React.ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({
  trigger,
  minWidth,
  triggerClassName,
  contentClassName,
  content,
  children,
  ...rootProps
}) => (
  <ContextMenuRoot {...rootProps}>
    <ContextMenuTrigger className={triggerClassName}>
      {trigger}
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuPositioner>
        <ContextMenuContent
          minWidth={minWidth}
          className={contentClassName}
          content={content}
        >
          {children}
        </ContextMenuContent>
      </ContextMenuPositioner>
    </ContextMenuPortal>
  </ContextMenuRoot>
);
