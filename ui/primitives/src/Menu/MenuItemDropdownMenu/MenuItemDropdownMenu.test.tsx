import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from '../../DropdownMenu';
import { MenuItem } from '../MenuItem/MenuItem';
import { MenuItemDropdownMenu } from './MenuItemDropdownMenu';

describe('<MenuItemDropdownMenu />', () => {
  afterEach(cleanup);

  it('forces the menu item actions to be visible when the dropdown menu is open', async () => {
    render(
      <MenuItem
        label="Menu Item"
        actions={
          <MenuItemDropdownMenu>
            <DropdownMenuTrigger>
              <button>Trigger</button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuPositioner>
                <DropdownMenuContent />
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </MenuItemDropdownMenu>
        }
      />,
    );

    // Actions should not be forced visible by default
    expect(screen.getByText('Menu Item')).not.toHaveClass(
      'force-actions-visible',
    );

    // Open the dropdown menu
    await userEvent.click(screen.getByText('Trigger'));

    // Actions should be forced visible
    await waitFor(() => {
      expect(screen.getByRole('menuitem')).toHaveClass('force-actions-visible');
    });

    // Close the dropdown menu
    await userEvent.click(screen.getByText('Menu Item'));

    // Actions should not be forced visible
    await waitFor(() => {
      expect(screen.getByRole('menuitem')).not.toHaveClass(
        'force-actions-visible',
      );
    });
  });

  it('preserves user defined onOpenChange callback', async () => {
    const onOpenChange = vi.fn();

    render(
      <MenuItem
        label="Menu Item"
        actions={
          <MenuItemDropdownMenu onOpenChange={onOpenChange}>
            <DropdownMenuTrigger>
              <button>Trigger</button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuPositioner>
                <DropdownMenuContent />
              </DropdownMenuPositioner>
            </DropdownMenuPortal>
          </MenuItemDropdownMenu>
        }
      />,
    );

    // Open the dropdown menu
    await userEvent.click(screen.getByText('Trigger'));

    // Callback should be called
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
