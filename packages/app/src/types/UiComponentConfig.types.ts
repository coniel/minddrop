import React from 'react';
import { IconName } from '@minddrop/icons';
import { AppCore } from './AppCore.types';

export type UiComponentConfigType =
  | 'primary-nav-item'
  | 'secondary-nav-item'
  | 'icon-button';

export interface BaseUiComponentConfig {
  /**
   * The type of component rendered by the config.
   */
  type: UiComponentConfigType;
}

export interface BaseNavItemConfig extends BaseUiComponentConfig {
  /**
   * The item label.
   */
  label: string;

  /**
   * The item icon.
   */
  icon: IconName;

  /**
   * The view ID opened by the item.
   */
  view: string;

  /**
   * The ID of the resource opened by the item.
   */
  resource?: string;
}

export interface PrimaryNavItemConfig extends BaseNavItemConfig {
  /**
   * Primary navigation menu item.
   */
  type: 'primary-nav-item';
}

export interface SecondaryNavItemConfig extends BaseNavItemConfig {
  /**
   * Secondary navigation menu item.
   */
  type: 'secondary-nav-item';
}

export interface IconButtonConfig {
  type: 'icon-button';

  /**
   * The button icon.
   */
  icon: IconName;

  /**
   * Hidden button label for accessibility purposes.
   * Should be the action name (e.g. 'Save').
   */
  label: string;

  /**
   * Callback fired when the item is clicked
   * (or activated using the keyboard).
   */
  onClick: (
    event: React.MouseEvent | React.KeyboardEvent,
    app: AppCore,
  ) => void;
}

export type UiComponentConfig =
  | PrimaryNavItemConfig
  | SecondaryNavItemConfig
  | IconButtonConfig;
