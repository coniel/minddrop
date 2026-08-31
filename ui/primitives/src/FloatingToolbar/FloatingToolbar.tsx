import React from 'react';
import { Toolbar, ToolbarProps } from '../Toolbar';
import { propsToClass } from '../utils';
import './FloatingToolbar.css';

export type FloatingToolbarSize = 'sm' | 'md' | 'lg';

export interface FloatingToolbarProps extends ToolbarProps {
  /**
   * The toolbar's contents.
   */
  children?: React.ReactNode;

  /**
   * Size of the toolbar's surface.
   * - `sm` - compact toolbars attached to a single element
   * - `md` - secondary toolbars, e.g. canvas zoom controls
   * - `lg` - a view's primary toolbar
   * @default 'lg'
   */
  size?: FloatingToolbarSize;

  /**
   * When true, the toolbar is always visible. Otherwise it is
   * revealed while its host is hovered.
   */
  visible?: boolean;

  /**
   * Class name applied to the toolbar element.
   */
  className?: string;
}

/**
 * Renders a toolbar on a floating surface, positioned by its
 * consumer.
 *
 * Unless made permanently visible, the toolbar is revealed while
 * its host is hovered, which requires the host element to carry
 * the `floating-toolbar-host` class.
 */
export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  children,
  size = 'lg',
  visible = false,
  className,
  ...other
}) => (
  <Toolbar
    className={propsToClass('floating-toolbar', { size, visible, className })}
    {...other}
  >
    {children}
  </Toolbar>
);
