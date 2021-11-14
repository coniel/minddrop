/* eslint-disable react/no-array-index-key */
import React from 'react';
import { MenuContents, MenuItem, MenuTriggerItemProps } from '../../types';

export interface MenuComponents {
  Item: React.ElementType<MenuItem>;
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
    // Generate Separator
    if (item === '---') {
      return [...items, <Separator key={index} />];
    }

    // Generate Label
    if (typeof item === 'string') {
      return [...items, <Label key={index}>{item}</Label>];
    }

    // Generate submenu
    if ('submenu' in item) {
      const { submenu, ...props } = item;

      return [
        ...items,
        <Menu key={index}>
          <TriggerItem {...props} />
          <MenuContent>{generateMenu(components, submenu)}</MenuContent>
        </Menu>,
      ];
    }

    // Generate Item
    return [...items, <Item key={index} {...item} />];
  }, []);
}
