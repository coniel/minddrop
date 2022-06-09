import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { InteractiveMenuItemProps } from '../../InteractiveMenuItem';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../../Menu';

export interface ContextMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onSelect?: InteractiveMenuItemProps['onSelect'];
  disabled?: InteractiveMenuItemProps['disabled'];
}

export const ContextMenuColorSelectionItem: FC<ContextMenuColorSelectionItemProps> =
  ({ disabled, color, ...other }) => {
    return (
      <ContextMenuPrimitives.Item asChild disabled={disabled} {...other}>
        <ColorSelectionMenuItem disabled={disabled} color={color} />
      </ContextMenuPrimitives.Item>
    );
  };
