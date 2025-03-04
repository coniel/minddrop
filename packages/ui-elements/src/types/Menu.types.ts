import React from 'react';
import { InteractiveMenuItemProps } from '../InteractiveMenuItem';
import { ContentColor } from './Content.types';

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

export interface MenuTopicSelectionItemConfig {
  type: 'menu-topic-selection-item';

  /**
   * The topic ID which can be used as the menu element's
   * key prop.
   */
  id: string;

  /**
   * The menu item label, typically the topic's title.
   */
  label: string;

  /**
   * `TopicSelectionMenuItemData` items representing the
   * topic's subtopics.
   */
  subtopics: MenuTopicSelectionItemConfig[];

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard). Calling `event.preventDefault`
   * in this handler will prevent the dropdown menu from
   * closing when selecting that item.
   *
   * @param event The event.
   */
  onSelect?(event: Event): void;
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
  onSelect?(event: Event): void;
}

export type MenuColorSelectionItemProps = Omit<
  MenuColorSelectionItemConfig,
  'type'
>;

export type SubmenuContents =
  | (
      | MenuItemConfig
      | SubmenuTriggerItemConfig
      | MenuTopicSelectionItemConfig
      | MenuColorSelectionItemConfig
      | React.ReactElement
    )[]
  | React.ReactElement;

export type MenuContents = (
  | MenuItemConfig
  | SubmenuTriggerItemConfig
  | MenuLabelConfig
  | MenuSeparatorConfig
  | MenuTopicSelectionItemConfig
  | MenuColorSelectionItemConfig
  | React.ReactElement
)[];
