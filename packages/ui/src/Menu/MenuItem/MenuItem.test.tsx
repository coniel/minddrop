import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { MenuItem } from './MenuItem';

describe('<MenuItem />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<MenuItem label="Copy" className="my-class" />);

    expect(screen.getByRole('menuitem')).toHaveClass('my-class');
  });

  it('renders the label', () => {
    render(<MenuItem label="Copy" />);

    expect(screen.getByRole('menuitem')).toHaveTextContent('Copy');
  });

  it('renders the description', () => {
    render(<MenuItem label="Text" description="A text drop" />);

    expect(screen.getByRole('menuitem')).toHaveTextContent('A text drop');
  });

  it('renders icon', () => {
    render(<MenuItem label="Copy" icon="duplicate" />);

    screen.getByTestId('icon');
  });

  it('renders named icon', () => {
    render(<MenuItem label="Copy" icon="settings" />);

    screen.getByTestId('icon');
  });

  it('renders submenu indicator', () => {
    render(<MenuItem hasSubmenu label="Copy" />);

    screen.getByTestId('submenu-indicator');
    expect(screen.getByRole('menuitem')).toHaveClass('has-submenu');
  });

  it('renders the keyboard shortcut', () => {
    render(<MenuItem label="Copy" keyboardShortcut={['A', 'B']} />);

    expect(screen.getByRole('menuitem')).toHaveTextContent('A+B');
  });

  it('can be disabled', () => {
    render(<MenuItem disabled label="Copy" />);

    expect(screen.getByRole('menuitem')).toHaveClass('disabled');
  });
});
