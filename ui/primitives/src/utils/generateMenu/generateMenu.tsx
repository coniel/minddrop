import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';
import { ContentColor } from '@minddrop/ui-theme';
import { ActionMenuItemProps } from '../../ActionMenuItem';
import {
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
  SubmenuPortal: React.ElementType;
  SubmenuPositioner: React.ElementType;
  ColorSelectionItem: React.ComponentType<{
    color: ContentColor | 'default';
    checked?: boolean;
    disabled?: boolean;
    onClick?: MenuPrimitive.Item.Props['onClick'];
  }>;
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
    SubmenuPortal,
    SubmenuPositioner,
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
      return [
        ...items,
        <Label key={index} stringLabel={item.stringLabel}>
          {item.label}
        </Label>,
      ];
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
            {/* The submenu is positioned beside its trigger, which
                without a positioner would render inline within the
                menu it belongs to */}
            <SubmenuPortal>
              <SubmenuPositioner side="right" align="start" sideOffset={4}>
                <SubmenuContent className={`menu ${submenuContentClass}`}>
                  {React.isValidElement(submenu)
                    ? submenu
                    : generateMenu(components, submenu)}
                </SubmenuContent>
              </SubmenuPositioner>
            </SubmenuPortal>
          </Submenu>,
        ];
      }

      const { type: _type, ...itemProps } = item;

      return [...items, <Item key={index} {...itemProps} />];
    }

    // Generate ColorSelectionItem
    if (type === 'menu-color-selection-item') {
      const { color, checked, onSelect } = item;

      return [
        ...items,
        <ColorSelectionItem
          key={index}
          color={color}
          checked={checked}
          onClick={onSelect}
        />,
      ];
    }

    return items;
  }, [] as React.ReactElement[]);
}
