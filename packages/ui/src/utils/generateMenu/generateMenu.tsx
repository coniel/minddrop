/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  MenuContents,
  MenuTriggerItemProps,
  TooltipMenuItemProps,
} from '../../types';

export interface MenuComponents {
  Item: React.ElementType<TooltipMenuItemProps>;
  Label: React.ElementType;
  Separator: React.ElementType;
  TriggerItem: React.ElementType<MenuTriggerItemProps>;
  Menu: React.ElementType;
  MenuContent: React.ElementType;
}

/**
 * Generates menu contents using the provided
 * components and item descriptors.
 */
export function generateMenu(
  components: MenuComponents,
  menu: MenuContents,
): React.ReactNode[] {
  const { Item, Label, Separator, Menu, MenuContent, TriggerItem } = components;

  return menu.reduce((items, item, index) => {
    const { type, ...props } = item;

    // Generate Separator
    if (type === 'menu-separator') {
      return [...items, <Separator key={index} />];
    }

    // Generate Label
    if (type === 'menu-label' && 'label' in item) {
      return [...items, <Label key={index}>{item.label}</Label>];
    }

    // Generate Item
    if (type === 'menu-item') {
      // Generate submenu
      if ('submenu' in item) {
        const { submenu, ...otherProps } = item;

        return [
          ...items,
          <Menu key={index}>
            <TriggerItem {...otherProps} />
            <MenuContent>{generateMenu(components, submenu)}</MenuContent>
          </Menu>,
        ];
      }

      return [
        ...items,
        <Item key={index} {...(props as TooltipMenuItemProps)} />,
      ];
    }

    if (React.isValidElement(item)) {
      return [...items, item];
    }

    return items;
  }, []);
}
