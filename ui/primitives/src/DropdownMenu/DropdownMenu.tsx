import { FC } from 'react';
import { MenuContents } from '../types';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuPortal } from './DropdownMenuPortal';
import {
  DropdownMenuPositioner,
  DropdownMenuPositionerProps,
} from './DropdownMenuPositioner';
import { DropdownMenuRoot, DropdownMenuRootProps } from './DropdownMenuRoot';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

/* --- DropdownMenu ---
   Convenience wrapper that composes Root + Trigger + Portal +
   Positioner + Content into a single component for the common case. */

export interface DropdownMenuProps extends DropdownMenuRootProps {
  /**
   * The element that triggers the dropdown menu.
   */
  trigger: React.ReactElement;

  /**
   * Which side of the trigger the menu appears on.
   * @default 'bottom'
   */
  side?: DropdownMenuPositionerProps['side'];

  /**
   * Alignment of the menu relative to the trigger.
   * @default 'start'
   */
  align?: DropdownMenuPositionerProps['align'];

  /**
   * Distance between the trigger and the menu edge (px).
   */
  sideOffset?: DropdownMenuPositionerProps['sideOffset'];

  /**
   * Minimum width of the menu panel (px).
   */
  minWidth?: number;

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

export const DropdownMenu: FC<DropdownMenuProps> = ({
  trigger,
  side = 'bottom',
  align = 'start',
  sideOffset,
  minWidth,
  contentClassName,
  content,
  children,
  ...rootProps
}) => (
  <DropdownMenuRoot {...rootProps}>
    <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuPositioner side={side} align={align} sideOffset={sideOffset}>
        <DropdownMenuContent
          minWidth={minWidth}
          className={contentClassName}
          content={content}
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenuPositioner>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
);
