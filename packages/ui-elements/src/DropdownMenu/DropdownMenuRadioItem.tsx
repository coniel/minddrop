import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';
import { Icon } from '../Icon';
import {
  InteractiveMenuItem,
  InteractiveRadioMenuItemProps,
} from '../InteractiveMenuItem';

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
