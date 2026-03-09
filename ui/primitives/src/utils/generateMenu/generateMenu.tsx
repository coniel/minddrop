import React from 'react';
import { ActionMenuItemProps } from '../../ActionMenuItem';
import {
  MenuColorSelectionItemProps,
  MenuContents,
  SubmenuContents,
  SubmenuTriggerItemProps,
} from '../../types';

export interface MenuComponents {
  Item: React.ElementType<ActionMenuItemProps>;
  Label: React.ElementType;
  Separator: React.ElementType;
  Submenu: React.ElementType;
  SubmenuTriggerItem: React.ElementType<SubmenuTriggerItemProps>;
  SubmenuContent: React.ElementType;
  ColorSelectionItem: React.ComponentType<MenuColorSelectionItemProps>;
}

/**
 * Generates menu contents using the provided
 * components and item descriptors.
 */
export function generateMenu(
  components: MenuComponents,
  menu: MenuContents | Exclude<SubmenuContents, React.ReactElement>,
): React.ReactNode[] {
  const {
    Item,
    Label,
    Separator,
    Submenu,
    SubmenuTriggerItem,
    SubmenuContent,
    ColorSelectionItem,
  } = components;

  return menu.reduce((items, item, index) => {
    // Pass through React elements as-is
    if (React.isValidElement(item)) {
      return [...items, item];
    }

    const { type } = item;

    // Generate Separator
    if (type === 'menu-separator') {
      return [...items, <Separator key={index} />];
    }

    // Generate Label
    if (type === 'menu-label') {
      return [...items, <Label key={index}>{item.label}</Label>];
    }

    // Generate Item
    if (type === 'menu-item') {
      // Generate submenu
      if ('submenu' in item) {
        const { type, submenu, submenuContentClass, ...otherProps } = item;

        return [
          ...items,
          <Submenu key={index}>
            <SubmenuTriggerItem {...otherProps} />
            <SubmenuContent className={`menu ${submenuContentClass}`}>
              {React.isValidElement(submenu)
                ? submenu
                : generateMenu(components, submenu)}
            </SubmenuContent>
          </Submenu>,
        ];
      }

      const { type: _type, ...itemProps } = item;

      return [...items, <Item key={index} {...itemProps} />];
    }

    // Generate ColorSelectionItem
    if (type === 'menu-color-selection-item') {
      const { color, onSelect } = item;

      return [
        ...items,
        <ColorSelectionItem key={index} color={color} onSelect={onSelect} />,
      ];
    }

    return items;
  }, [] as React.ReactElement[]);
}
