/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  render,
  cleanup,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@minddrop/test-utils';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../DropdownMenu';
import { InteractiveMenuItem } from './InteractiveMenuItem';

const Container: React.FC = ({ children }) => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger>
      <div data-testid="target" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>{children}</DropdownMenuContent>
  </DropdownMenu>
);

describe('<DropdownMenuItem />', () => {
  afterEach(cleanup);

  describe('primary state', () => {
    it('renders the label', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
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
      const onSelect = jest.fn();
      const onSelectSecondary = jest.fn();

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
    it('renders the secondary label', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryLabel="Secondary label"
            secondaryOnSelect={jest.fn()}
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
            secondaryOnSelect={jest.fn()}
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
      const onSelect = jest.fn();
      const onSelectSecondary = jest.fn();

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
            secondaryOnSelect={jest.fn()}
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
    act(() => {
      fireEvent.mouseOver(screen.getByRole('menuitem'));
    });

    await waitFor(() => screen.getAllByText('Tooltip title'));
    screen.getAllByText('Tooltip description');
  });
});
