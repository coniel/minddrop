import { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import {
  InteractiveMenuItem,
  InteractiveRadioMenuItemProps,
} from '../InteractiveMenuItem';
import { Icon } from '../Icon';

export type ContextMenuRadioItemProps = Omit<
  InteractiveRadioMenuItemProps,
  'MenuItemComponent'
>;

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
