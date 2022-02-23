import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { TooltipMenuItemProps } from '../../types';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../../Menu';

export interface ContextMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onSelect?: TooltipMenuItemProps['onSelect'];
  disabled?: TooltipMenuItemProps['disabled'];
}

export const ContextMenuColorSelectionItem: FC<ContextMenuColorSelectionItemProps> =
  ({ disabled, color, ...other }) => {
    return (
      <ContextMenuPrimitives.Item asChild disabled={disabled} {...other}>
        <ColorSelectionMenuItem disabled={disabled} color={color} />
      </ContextMenuPrimitives.Item>
    );
  };
