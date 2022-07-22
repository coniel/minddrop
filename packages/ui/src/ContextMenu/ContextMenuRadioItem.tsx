import React, { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import {
  InteractiveMenuItem,
  InteractiveMenuItemProps,
} from '../InteractiveMenuItem';
import { Icon } from '../Icon';

export type ContextMenuRadioItemProps = Omit<
  InteractiveMenuItemProps,
  'MenuItemComponent'
> &
  Pick<ContextMenuPrimitives.MenuRadioItemProps, 'value'>;

export const ContextMenuRadioItem: FC<ContextMenuRadioItemProps> = (props) => (
  <InteractiveMenuItem
    MenuItemComponent={ContextMenuPrimitives.RadioItem}
    itemIndicator={
      <ContextMenuPrimitives.ItemIndicator>
        <Icon name="checkmark" className="item-indicator" />
      </ContextMenuPrimitives.ItemIndicator>
    }
    {...props}
  />
);
