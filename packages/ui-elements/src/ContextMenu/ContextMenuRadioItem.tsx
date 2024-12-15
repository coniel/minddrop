import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { FC } from 'react';
import { Icon } from '../Icon';
import {
  InteractiveMenuItem,
  InteractiveRadioMenuItemProps,
} from '../InteractiveMenuItem';

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
