import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { MenuItem } from './MenuItem';

describe('<MenuItem />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<MenuItem label="Copy" className="my-class" />);

    expect(screen.getByRole('menuitem').className).toContain('my-class');
  });

  it('renders the label', () => {
    render(<MenuItem label="Copy" />);

    expect(screen.getByRole('menuitem').textContent).toBe('Copy');
  });

  it('renders icon', () => {
    render(<MenuItem label="Copy" icon="copy" />);

    screen.getByTestId('icon');
  });

  it('renders named icon', () => {
    render(<MenuItem label="Copy" icon="settings" />);

    screen.getByTestId('icon');
  });

  it('renders submenu indicator', () => {
    render(<MenuItem hasSubmenu label="Copy" />);

    screen.getByTestId('submenu-indicator');
    expect(screen.getByRole('menuitem').className).toContain('has-submenu');
  });

  it('renders the keyboard shortcut', () => {
    render(<MenuItem label="Copy" keyboardShortcut={['A', 'B']} />);

    expect(screen.getByRole('menuitem').textContent).toContain('A+B');
  });

  it('can be disabled', () => {
    render(<MenuItem disabled label="Copy" />);

    expect(screen.getByRole('menuitem').className).toContain('disabled');
  });
});
