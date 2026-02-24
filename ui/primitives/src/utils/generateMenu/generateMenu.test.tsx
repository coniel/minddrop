import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { MenuItemRendererProps } from '../../MenuItemRenderer';
import {
  MenuColorSelectionItemConfig,
  MenuColorSelectionItemProps,
  MenuItemConfig,
  MenuLabelConfig,
  MenuSeparatorConfig,
  SubmenuTriggerItemProps,
} from '../../types';
import { generateMenu } from './generateMenu';

const Item: React.FC<MenuItemRendererProps> = ({ label }) => (
  <div data-testid="item">{label}</div>
);

const Label: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="label">{children}</div>
);

const Separator: React.FC = () => <div data-testid="separator" />;

const Menu: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="menu">{children}</div>
);

const MenuContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
}) => (
  <div data-testid="menu-content">
    {children}
    <div>{className}</div>
  </div>
);

const Submenu: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="submenu">{children}</div>
);

const SubmenuTriggerItem: React.FC<SubmenuTriggerItemProps> = ({ label }) => (
  <div data-testid="submenu-trigger-item">{label}</div>
);

const SubmenuContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
}) => (
  <div data-testid="submenu-content">
    {children}
    <div>{className}</div>
  </div>
);

const ColorSelectionItem: React.FC<MenuColorSelectionItemProps> = ({
  color,
}) => <div>{color}</div>;

const item: MenuItemConfig = {
  type: 'menu-item',
  label: 'label',
  icon: 'settings',
  onClick: vi.fn(),
  keyboardShortcut: ['A', 'B'],
};

const label: MenuLabelConfig = {
  type: 'menu-label',
  label: 'Actions',
};

const separator: MenuSeparatorConfig = {
  type: 'menu-separator',
};

const colorSelectionItem: MenuColorSelectionItemConfig = {
  type: 'menu-color-selection-item',
  color: 'red',
  onSelect: vi.fn(),
};

const components = {
  Item,
  Label,
  Separator,
  Menu,
  MenuContent,
  Submenu,
  SubmenuTriggerItem,
  SubmenuContent,
  ColorSelectionItem,
};

describe('generateMenu', () => {
  afterEach(cleanup);
  it('generates menu items', () => {
    const menu = generateMenu(components, [item]);
    render(<div>{menu}</div>);

    expect(screen.getByTestId('item').textContent).toBe('label');
  });

  it('generates menu labels', () => {
    const menu = generateMenu(components, [label]);
    render(<div>{menu}</div>);

    expect(screen.getByTestId('label').textContent).toBe('Actions');
  });

  it('generates menu separators', () => {
    const menu = generateMenu(components, [separator]);
    render(<div>{menu}</div>);

    screen.getByTestId('separator');
  });

  it('generates submenus', () => {
    const menu = generateMenu(components, [
      {
        ...item,
        label: 'trigger label',
        submenu: [item],
        submenuContentClass: 'submenu-content-class',
      },
    ]);
    render(<div>{menu}</div>);

    screen.getByTestId('submenu');
    screen.getByTestId('submenu-content');
    expect(screen.getByTestId('submenu-trigger-item').textContent).toBe(
      'trigger label',
    );
    expect(screen.getByTestId('item').textContent).toBe('label');
    // Sets submenuContentClass as submenu's MenuContent className
    screen.getByText('menu submenu-content-class');
  });

  it('generates component based submenus', () => {
    const menu = generateMenu(components, [
      { ...item, label: 'trigger label', submenu: <div>submenu</div> },
    ]);
    render(<div>{menu}</div>);

    screen.getByTestId('submenu');
    screen.getByTestId('submenu-content');
    expect(screen.getByTestId('submenu-trigger-item').textContent).toBe(
      'trigger label',
    );
    screen.getByText('submenu');
  });

  it('generates color selection items', () => {
    const menu = generateMenu(components, [colorSelectionItem]);

    render(<div>{menu}</div>);

    screen.getByText(colorSelectionItem.color);
  });

  it('retuns custom components as is', () => {
    const menu = generateMenu(components, [
      <div key="custom" data-testid="custom-component">
        custom component
      </div>,
    ]);

    render(<div>{menu}</div>);

    screen.getByTestId('custom-component');
    screen.getByText('custom component');
  });
});
