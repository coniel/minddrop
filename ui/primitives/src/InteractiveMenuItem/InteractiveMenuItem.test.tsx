import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { TooltipProvider } from '../Tooltip';
import { InteractiveMenuItem } from './InteractiveMenuItem';

const DropdownMenuItem = DropdownMenuPrimitives.Item;

const Container: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => (
  <TooltipProvider>
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>
        <div data-testid="target" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  </TooltipProvider>
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

    it('calls onClick when selected', () => {
      const onClick = vi.fn();
      const onClickSecondary = vi.fn();

      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="item"
            onClick={onClick}
            secondaryOnClick={onClickSecondary}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </Container>,
      );

      // Click the item
      fireEvent.click(screen.getByRole('menuitem'));

      // Should call onClick callback
      expect(onClick).toHaveBeenCalled();
      // Should not call secondaryOnClick callback
      expect(onClickSecondary).not.toHaveBeenCalled();
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
            secondaryOnClick={vi.fn()}
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

    it('renders the secondary icon', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryOnClick={vi.fn()}
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

    it('calls secondaryOnClick when selected', () => {
      const onClick = vi.fn();
      const onClickSecondary = vi.fn();

      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="item"
            onClick={onClick}
            secondaryOnClick={onClickSecondary}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </Container>,
      );

      // Press shift key
      fireEvent.keyDown(window, { key: 'Shift' });

      // Click the item
      fireEvent.click(screen.getByRole('menuitem'));

      // Should call secondaryOnClick callback
      expect(onClickSecondary).toHaveBeenCalled();
      // Should not call primary onClick callback
      expect(onClick).not.toHaveBeenCalled();
    });

    it('renders the secondary keyboard shortcut', () => {
      render(
        <Container>
          <InteractiveMenuItem
            MenuItemComponent={DropdownMenuItem}
            label="Primary label"
            secondaryOnClick={vi.fn()}
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
