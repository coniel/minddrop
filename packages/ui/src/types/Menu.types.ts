import React from 'react';
import {
  ContextMenuItemProps,
  ContextMenuTriggerItemProps,
} from '@radix-ui/react-context-menu';
import { IconProp } from '../IconRenderer';

export interface MenuItem {
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
export interface MenuLabel {
  type: 'menu-label';
  label: string;
}

export interface MenuSeparator {
  type: 'menu-separator';
}

export type MenuItemProps = Omit<MenuItem, 'type'>;

export interface MenuTriggerItemProps
  extends Omit<
    MenuItemProps,
    'tooltipTitle' | 'tooltipDescription' | 'keyboardShortcut' | 'onSelect'
  > {
  type: 'menu-item';
  onSelect?: ContextMenuTriggerItemProps['onSelect'];
}

export interface MenuTriggerItem extends MenuTriggerItemProps {
  submenu: (MenuItem | MenuTriggerItem)[];
}

export type MenuContents = (
  | MenuItem
  | MenuTriggerItem
  | MenuLabel
  | MenuSeparator
  | React.ReactElement
)[];
