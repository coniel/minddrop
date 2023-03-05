import { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import {
  InteractiveMenuItem,
  InteractiveRadioMenuItemProps,
} from '../InteractiveMenuItem';
import { Icon } from '../Icon';

export type DropdownMenuRadioItemProps = Omit<
  InteractiveRadioMenuItemProps,
  'MenuItemComponent'
>;

export const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = (
  props,
) => (
  <InteractiveMenuItem
    MenuItemComponent={DropdownMenuPrimitives.RadioItem}
    itemIndicator={
      <DropdownMenuPrimitives.ItemIndicator>
        <Icon name="checkmark" className="item-indicator" />
      </DropdownMenuPrimitives.ItemIndicator>
    }
    {...props}
  />
);
