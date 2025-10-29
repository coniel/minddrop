import { Toolbar as ToolbarPrimitives } from '@base-ui-components/react/toolbar';
import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { IconButton, IconButtonProps } from '../IconButton';
import './Toolbar.css';

export interface ToolbarProps
  extends Omit<ToolbarPrimitives.Root.Props, 'dir'> {
  /**
   * The contents of the toolbar. All children should be `Toolbar*` components, such as `ToolbarIconButton`.
   */
  children?: React.ReactNode;

  /**
   * The reading direction of the toolbar. If omitted, assumes LTR (left-to-right) reading mode.
   */
  direction?: 'ltr' | 'rtl';

  /**
   * When `true`, keyboard navigation will loop from last tab to first, and vice versa.
   */
  loop?: boolean;

  /**
   * The orientation of the toolbar.
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS classes to apply to the toolbar.
   */
  className?: string;
}

export const Toolbar: FC<ToolbarProps> = ({
  children,
  className,
  direction,
  ...other
}) => (
  <ToolbarPrimitives.Root
    className={mapPropsToClasses({ className }, 'toolbar')}
    dir={direction}
    {...other}
  >
    {children}
  </ToolbarPrimitives.Root>
);

export const ToolbarIconButton: FC<IconButtonProps> = ({
  children,
  ...other
}) => (
  <IconButton {...other} as={ToolbarPrimitives.Button}>
    {children}
  </IconButton>
);
