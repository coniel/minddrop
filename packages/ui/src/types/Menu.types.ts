import React from 'react';
import {
  ContextMenuItemProps,
  ContextMenuTriggerItemProps,
} from '@radix-ui/react-context-menu';
import { IconProp } from '../IconRenderer';

export interface MenuItemConfig {
  type: 'menu-item';
  label: React.ReactNode;
  onSelect: ContextMenuItemProps['onSelect'];
  icon?: IconProp;
  keyboardShortcut?: string[];
  tooltipTitle?: React.ReactNode;
  tooltipDescription?: React.ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export type TooltipMenuItemProps = Omit<MenuItemConfig, 'type'>;

export interface MenuLabelConfig {
  type: 'menu-label';
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
  onSelect?: ContextMenuTriggerItemProps['onSelect'];
}

export interface MenuTriggerItemConfig extends MenuTriggerItemProps {
  submenu: (MenuItemConfig | MenuTriggerItemConfig)[];
  type: 'menu-item';
}

export type MenuContents = (
  | MenuItemConfig
  | MenuTriggerItemConfig
  | MenuLabelConfig
  | MenuSeparatorConfig
  | React.ReactElement
)[];
