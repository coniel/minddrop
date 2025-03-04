import React from 'react';
import { InteractiveMenuItemProps } from '../../InteractiveMenuItem';
import { TopicSelectionMenuItemProps } from '../../Menu/TopicSelectionMenuItem';
import {
  MenuColorSelectionItemConfig,
  MenuColorSelectionItemProps,
  MenuContents,
  MenuTopicSelectionItemConfig,
  SubmenuTriggerItemProps,
} from '../../types';

export interface MenuComponents {
  Item: React.ElementType<InteractiveMenuItemProps>;
  Label: React.ElementType;
  Separator: React.ElementType;
  Submenu: React.ElementType;
  SubmenuTriggerItem: React.ElementType<SubmenuTriggerItemProps>;
  SubmenuContent: React.ElementType;
  TopicSelectionItem: React.ElementType<
    Omit<TopicSelectionMenuItemProps, 'MenuItemComponent'>
  >;
  ColorSelectionItem: React.ComponentType<MenuColorSelectionItemProps>;
}

/**
 * Generates menu contents using the provided
 * components and item descriptors.
 */
export function generateMenu(
  components: MenuComponents,
  menu: MenuContents,
): React.ReactNode[] {
  const {
    Item,
    Label,
    Separator,
    Submenu,
    SubmenuTriggerItem,
    SubmenuContent,
    TopicSelectionItem,
    ColorSelectionItem,
  } = components;

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
        const { type, submenu, submenuContentClass, ...otherProps } = item;

        return [
          ...items,
          <Submenu key={index}>
            <SubmenuTriggerItem {...otherProps} />
            <SubmenuContent className={`menu ${submenuContentClass}`}>
              {React.isValidElement(submenu)
                ? submenu
                : generateMenu(components, submenu as MenuContents)}
            </SubmenuContent>
          </Submenu>,
        ];
      }

      return [
        ...items,
        <Item key={index} {...(props as InteractiveMenuItemProps)} />,
      ];
    }

    // Generate TopicSelectionItem
    if (type === 'menu-topic-selection-item') {
      const { label, subtopics, onSelect } =
        item as MenuTopicSelectionItemConfig;

      return [
        ...items,
        <TopicSelectionItem key={index} label={label} onSelect={onSelect}>
          {
            generateMenu(
              components,
              subtopics,
            ) as unknown as TopicSelectionMenuItemProps['children']
          }
        </TopicSelectionItem>,
      ];
    }

    // Generate ColorSelectionItem
    if (type === 'menu-color-selection-item') {
      const { color, onSelect } = item as MenuColorSelectionItemConfig;

      return [
        ...items,
        <ColorSelectionItem key={index} color={color} onSelect={onSelect} />,
      ];
    }

    if (React.isValidElement(item)) {
      return [...items, item];
    }

    return items;
  }, [] as React.ReactElement[]);
}
