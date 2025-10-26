import React from 'react';
import { InteractiveMenuItemProps } from '../InteractiveMenuItem';
import { ContentColor } from './ContentColor.types';

export interface MenuItemConfig
  extends Omit<InteractiveMenuItemProps, 'MenuItemComponent'> {
  type: 'menu-item';
}

export interface MenuLabelConfig {
  type: 'menu-label';

  /**
   * The menu label text.
   */
  label: string;
}

export interface MenuSeparatorConfig {
  type: 'menu-separator';
}

export interface SubmenuTriggerItemProps
  extends Pick<
    InteractiveMenuItemProps,
    'label' | 'icon' | 'disabled' | 'textValue'
  > {
  /**
   * Class name applied to the submenu's MenuContent component.
   */
  submenuContentClass?: string;
}

export interface SubmenuTriggerItemConfig extends SubmenuTriggerItemProps {
  type: 'menu-item';

  /**
   * An array of MenuContents which will be used to
   * generate the submenu.
   */
  submenu: SubmenuContents;
}

export interface MenuColorSelectionItemConfig {
  type: 'menu-color-selection-item';

  /**
   * The color option which the menu item represents.
   * Must be a `ContentColor`.
   */
  color: ContentColor;

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard). Calling `event.preventDefault`
   * in this handler will prevent the dropdown menu from
   * closing when selecting that item.
   *
   * @param event The event.
   */
  onSelect?: InteractiveMenuItemProps['onSelect'];
}

export type MenuColorSelectionItemProps = Omit<
  MenuColorSelectionItemConfig,
  'type'
>;

export type SubmenuContents =
  | (
      | MenuItemConfig
      | SubmenuTriggerItemConfig
      | MenuColorSelectionItemConfig
      | React.ReactElement
    )[]
  | React.ReactElement;

export type MenuContents = (
  | MenuItemConfig
  | SubmenuTriggerItemConfig
  | MenuLabelConfig
  | MenuSeparatorConfig
  | MenuColorSelectionItemConfig
  | React.ReactElement
)[];
