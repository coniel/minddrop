import React from 'react';
import {
  ContextMenuItemProps,
  ContextMenuTriggerItemProps,
} from '@radix-ui/react-context-menu';
import { IconProp } from '../IconRenderer';

export interface MenuItemConfig {
  type: 'menu-item';

  /**
   * The menu item's label.
   */
  label: React.ReactNode;

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard). Calling `event.preventDefault`
   * in this handler will prevent the dropdown menu from
   * closing when selecting that item.
   */
  onSelect: ContextMenuItemProps['onSelect'];

  /**
   * The menu item's icon.
   */
  icon?: IconProp;

  /**
   * The keyboard shortcut used to trigger the action.
   */
  keyboardShortcut?: string[];

  /**
   * If set, a tooltip will be added to the menu item
   * using this property as its title.
   */
  tooltipTitle?: React.ReactNode;

  /**
   * If set, a tooltip will be added to the menu item
   * using this property as its description.
   */
  tooltipDescription?: React.ReactNode;

  /**
   * When `true`, prevents the user from interacting with
   * the item.
   */
  disabled?: boolean;

  /**
   * Optional text used for typeahead purposes.
   * By default the typeahead behavior will use the
   * `textContent` of the item. Use this when the
   * content is complex, or you have non-textual
   * content inside.
   */
  textValue?: string;
}

export type TooltipMenuItemProps = Omit<MenuItemConfig, 'type'>;

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

export interface MenuTriggerItemProps
  extends Omit<
    TooltipMenuItemProps,
    'tooltipTitle' | 'tooltipDescription' | 'keyboardShortcut' | 'onSelect'
  > {
  /**
   * Callback fired when the menu item is selected.
   */
  onSelect?: ContextMenuTriggerItemProps['onSelect'];

  /**
   * Class name applied to the submenu's MenuContent component.
   */
  submenuContentClass?: string;
}

export interface MenuTriggerItemConfig extends MenuTriggerItemProps {
  type: 'menu-item';

  /**
   * An array of MenuContents which will be used to
   * generate the submenu.
   */
  submenu:
    | (
        | MenuItemConfig
        | MenuTriggerItemConfig
        | MenuTopicSelectionItemConfig
        | React.ReactElement
      )[]
    | React.ReactElement;
}

export interface MenuTopicSelectionItemConfig {
  type: 'menu-topic-selection-item';
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

export type MenuContents = (
  | MenuItemConfig
  | MenuTriggerItemConfig
  | MenuLabelConfig
  | MenuSeparatorConfig
  | MenuTopicSelectionItemConfig
  | React.ReactElement
)[];
