import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
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

// TODO: Fix the type of the MenuItemComponent prop

export const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = (
  props,
) => (
  <InteractiveMenuItem
    // @ts-ignore
    MenuItemComponent={DropdownMenuPrimitives.RadioItem}
    itemIndicator={
      <DropdownMenuPrimitives.RadioItemIndicator>
        <Icon name="check" className="item-indicator" />
      </DropdownMenuPrimitives.RadioItemIndicator>
    }
    {...props}
  />
);
