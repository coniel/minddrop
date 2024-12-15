import * as RadixToolbar from '@radix-ui/react-toolbar';
import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { IconButton, IconButtonProps } from '../IconButton';
import './Toolbar.css';

export interface ToolbarProps extends Omit<RadixToolbar.ToolbarProps, 'dir'> {
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
}

export const Toolbar: FC<ToolbarProps> = ({
  children,
  className,
  direction,
  ...other
}) => (
  <RadixToolbar.Root
    className={mapPropsToClasses({ className }, 'toolbar')}
    dir={direction}
    {...other}
  >
    {children}
  </RadixToolbar.Root>
);

export const ToolbarIconButton: FC<IconButtonProps> = ({
  children,
  ...other
}) => (
  <IconButton {...other} as={RadixToolbar.Button}>
    {children}
  </IconButton>
);
