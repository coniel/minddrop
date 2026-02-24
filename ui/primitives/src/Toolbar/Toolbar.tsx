import { Toolbar as ToolbarPrimitives } from '@base-ui/react/toolbar';
import React, { FC } from 'react';
import { Button, ButtonProps } from '../Button';
import { IconButton, IconButtonProps } from '../IconButton';
import { propsToClass } from '../utils';
import './Toolbar.css';

export interface ToolbarProps
  extends Omit<ToolbarPrimitives.Root.Props, 'dir'> {
  /*
   * Toolbar contents. Use Toolbar* components as children for
   * correct keyboard navigation behaviour.
   */
  children?: React.ReactNode;

  /*
   * Reading direction. Affects keyboard navigation order.
   * @default 'ltr'
   */
  direction?: 'ltr' | 'rtl';

  /*
   * When true, keyboard navigation loops from last item to first.
   * @default false
   */
  loop?: boolean;

  /*
   * Orientation of the toolbar.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /*
   * Class name applied to the root element.
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
    className={propsToClass('toolbar', { className })}
    dir={direction}
    {...other}
  >
    {children}
  </ToolbarPrimitives.Root>
);

/*
 * An IconButton wired into the toolbar's keyboard navigation.
 */
export const ToolbarIconButton: FC<IconButtonProps> = (props) => (
  <IconButton {...props} as={ToolbarPrimitives.Button} />
);

/*
 * A Button wired into the toolbar's keyboard navigation.
 */
export const ToolbarButton: FC<ButtonProps> = (props) => (
  <ToolbarPrimitives.Button render={<Button {...props} />} />
);

/*
 * A visual separator between toolbar groups.
 */
export const ToolbarSeparator: FC = () => (
  <ToolbarPrimitives.Separator className="toolbar-separator" />
);
