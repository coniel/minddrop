import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { MenuItem, MenuTriggerItemProps } from '../../types';
import { generateMenu } from './generateMenu';

const Item: React.FC<MenuItem> = ({ label }) => (
  <div data-testid="item">{label}</div>
);

const TriggerItem: React.FC<MenuTriggerItemProps> = ({ label }) => (
  <div data-testid="trigger-item">{label}</div>
);

const Label: React.FC = ({ children }) => (
  <div data-testid="label">{children}</div>
);

const Separator: React.FC = () => <div data-testid="separator" />;

const Menu: React.FC = ({ children }) => (
  <div data-testid="menu">{children}</div>
);

const MenuContent: React.FC = ({ children }) => (
  <div data-testid="menu-content">{children}</div>
);

const item: MenuItem = {
  label: 'label',
  icon: 'icon',
  onSelect: jest.fn(),
  keyboardShortcut: ['A', 'B'],
};

const components = { Item, TriggerItem, Label, Separator, Menu, MenuContent };

describe('generateMenu', () => {
  afterEach(cleanup);
  it('generates menu items', () => {
    const menu = generateMenu(components, [item]);
    render(<div>{menu}</div>);

    expect(screen.getByTestId('item')).toHaveTextContent('label');
  });

  it('generates menu labels', () => {
    const menu = generateMenu(components, ['Actions']);
    render(<div>{menu}</div>);

    expect(screen.getByTestId('label')).toHaveTextContent('Actions');
  });

  it('generates menu separators', () => {
    const menu = generateMenu(components, ['---']);
    render(<div>{menu}</div>);

    screen.getByTestId('separator');
  });

  it('generates submenus', () => {
    const menu = generateMenu(components, [
      { ...item, label: 'trigger label', submenu: [item] },
    ]);
    render(<div>{menu}</div>);

    screen.getByTestId('menu');
    screen.getByTestId('menu-content');
    expect(screen.getByTestId('trigger-item')).toHaveTextContent(
      'trigger label',
    );
    expect(screen.getByTestId('item')).toHaveTextContent('label');
  });
});
