import { describe, afterEach, it, expect, vi } from 'vitest';
import React from 'react';
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
  userEvent,
} from '@minddrop/test-utils';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../DropdownMenu';
import { InteractiveMenuItem } from './InteractiveMenuItem';
import { i18n } from '@minddrop/i18n';

const DropdownMenuItem = DropdownMenuPrimitives.Item;

const Container: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger>
      <div data-testid="target" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>{children}</DropdownMenuContent>
  </DropdownMenu>
);

describe('<InteractiveMenuItem />', () => {
  afterEach(cleanup);

  describe('primary state', () => {
    it('renders string label as translation', () => {
      const { queryByText, getByTranslatedText } = render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="test"
            secondaryLabel="Secondary label"
          />
        </Container>,
      );

      // Renders primary label
      getByTranslatedText('test');
      // Should not render secondary label
      expect(queryByText('Secondary label')).toBeNull();
    });

    it('renders element label as is', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label={<span>Primary label</span>}
            secondaryLabel="Secondary label"
          />
        </Container>,
      );

      // Renders primary label
      screen.getByText('Primary label');
      // Should not render secondary label
      expect(screen.queryByText('Secondary label')).toBeNull();
    });

    it('renders the icon', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            icon={<span>primary icon</span>}
            secondaryIcon={<span>secondary icon</span>}
          />
        </Container>,
      );

      // Renders primary icon
      screen.getByText('primary icon');
      // Should not render secondary icon
      expect(screen.queryByText('secondary icon')).toBeNull();
    });

    it('calls onSelect when selected', () => {
      const onSelect = vi.fn();
      const onSelectSecondary = vi.fn();

      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="item"
            onSelect={onSelect}
            secondaryOnSelect={onSelectSecondary}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </Container>,
      );

      // Click the item
      fireEvent.click(screen.getByRole('menuitem'));

      // Should call onSelect callback
      expect(onSelect).toHaveBeenCalled();
      // Should not call secondaryOnSelect callback
      expect(onSelectSecondary).not.toHaveBeenCalled();
    });

    it('renders the keyboard shortcut', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            keyboardShortcut={['primary shortcut']}
            secondaryKeyboardShortcut={['secondary shortcut']}
          />
        </Container>,
      );

      // Renders keyboard shortcut
      screen.getByText('primary shortcut');
      // Does not render secondary keyboard shortcut
      expect(screen.queryByText('secondary shortcut')).toBeNull();
    });
  });

  describe('secondary state', () => {
    it('renders string secondary label as translation', () => {
      const { queryByText, getByTranslatedText } = render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryLabel="test"
            secondaryOnSelect={vi.fn()}
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Renders secondary label
      getByTranslatedText('test');
      // Should not render primary label
      expect(queryByText('Primary label')).toBeNull();
    });

    it('renders the secondary label element', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryLabel={<span>Secondary label</span>}
            secondaryOnSelect={vi.fn()}
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Renders secondary label
      screen.getByText('Secondary label');
      // Should not render primary label
      expect(screen.queryByText('Primary label')).toBeNull();
    });

    it('renders the secondary icon', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryOnSelect={vi.fn()}
            icon={<span>primary icon</span>}
            secondaryIcon={<span>secondary icon</span>}
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Renders secondary icon
      screen.getByText('secondary icon');
      // Should not render primary icon
      expect(screen.queryByText('primary icon')).toBeNull();
    });

    it('calls secondaryOnSelect when selected', () => {
      const onSelect = vi.fn();
      const onSelectSecondary = vi.fn();

      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="item"
            onSelect={onSelect}
            secondaryOnSelect={onSelectSecondary}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Click the item
      fireEvent.click(screen.getByRole('menuitem'));

      // Should call secondaryOnSelect callback
      expect(onSelectSecondary).toHaveBeenCalled();
      // Should not call primary onSelect callback
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('renders the secondary keyboard shortcut', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryOnSelect={vi.fn()}
            keyboardShortcut={['primary shortcut']}
            secondaryKeyboardShortcut={['secondary shortcut']}
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Renders secondary keyboard shortcut
      screen.getByText('secondary shortcut');
      // Does not render primary keyboard shortcut
      expect(screen.queryByText('primary shortcut')).toBeNull();
    });
  });

  it('renders tooltip title and description', async () => {
    const user = userEvent.setup();

    render(
      <Container>
        <InteractiveMenuItem
          MenuItemComponent={DropdownMenuItem}
          label="item"
          tooltipTitle="Tooltip title"
          tooltipDescription="Tooltip description"
        />
      </Container>,
    );

    // Hover over item
    user.hover(screen.getByRole('menuitem'));

    await waitFor(() => screen.getAllByText('Tooltip title'));
    screen.getAllByText('Tooltip description');
  });
});
