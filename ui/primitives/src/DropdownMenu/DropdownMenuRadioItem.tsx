import { Menu as DropdownMenuPrimitives } from '@base-ui-components/react/menu';
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
      <DropdownMenuPrimitives.RadioItemIndicator>
        <Icon name="check" className="item-indicator" />
      </DropdownMenuPrimitives.RadioItemIndicator>
    }
    {...props}
  />
);
