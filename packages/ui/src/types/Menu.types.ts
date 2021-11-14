import React from 'react';
import {
  ContextMenuItemProps,
  ContextMenuTriggerItemProps,
} from '@radix-ui/react-context-menu';
import { IconProp } from '../IconRenderer';

export interface MenuItem {
  label: React.ReactNode;
  onSelect: ContextMenuItemProps['onSelect'];
  icon?: IconProp;
  keyboardShortcut?: string[];
  tooltipTitle?: React.ReactNode;
  tooltipDescription?: React.ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export type MenuItemProps = MenuItem;

export interface MenuTriggerItemProps
  extends Omit<
    MenuItem,
    'tooltipTitle' | 'tooltipDescription' | 'keyboardShortcut' | 'onSelect'
  > {
  onSelect?: ContextMenuTriggerItemProps['onSelect'];
}

export interface MenuTriggerItem extends MenuTriggerItemProps {
  submenu: (MenuItem | MenuTriggerItem | 'string')[];
}

export type MenuContents = (MenuItem | MenuTriggerItem | string | '---')[];
