import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { SearchableMenuItem } from '../../SearchableMenu';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuPortal } from '../DropdownMenuPortal';
import { DropdownMenuPositioner } from '../DropdownMenuPositioner';
import { DropdownSubmenuContent } from '../DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from '../DropdownSubmenuTriggerItem';
import { DropdownSubmenu } from './DropdownSubmenu';

const onSelectTable = vi.fn();

// A searchable menu listing a submenu among its items, the case Base
// UI cannot handle on its own: its items are not Base UI menu items.
// Its contents are listed flat while searching, as the menus which
// nest a submenu do, there being nothing to open a submenu from.
const SearchableSubmenu: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <DropdownMenu
      searchable
      onSearchTermChange={setQuery}
      trigger={<button type="button">Open</button>}
    >
      <SearchableMenuItem stringLabel="Group" />
      <SearchableMenuItem stringLabel="Space" />
      {query ? (
        <>
          <SearchableMenuItem stringLabel="Table" onSelect={onSelectTable} />
          <SearchableMenuItem stringLabel="Board" />
        </>
      ) : (
        <DropdownSubmenu>
          <DropdownSubmenuTriggerItem stringLabel="Data view" />
          <DropdownMenuPortal>
            <DropdownMenuPositioner>
              <DropdownSubmenuContent>
                <SearchableMenuItem
                  stringLabel="Table"
                  onSelect={onSelectTable}
                />
                <SearchableMenuItem stringLabel="Board" />
              </DropdownSubmenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownSubmenu>
      )}
      <SearchableMenuItem stringLabel="Database" />
    </DropdownMenu>
  );
};

// Open the menu and its submenu with the pointer, moving into the
// submenu, which is what hands the closing back to the menu: Base UI
// stops closing the submenu on hover once the pointer has been in it.
async function hoverOpenSubmenu() {
  await userEvent.click(screen.getByRole('button', { name: 'Open' }));
  await userEvent.hover(await screen.findByText('Data view'));
  await userEvent.hover(await screen.findByText('Table'));
}

// The labels of the items the menu currently highlights
function highlighted() {
  return Array.from(document.querySelectorAll('.menu-item-active')).map(
    (element) => element.textContent,
  );
}

describe('DropdownSubmenu', () => {
  afterEach(cleanup);

  describe('closing on hover', () => {
    it('closes when another item of the menu is hovered', async () => {
      render(<SearchableSubmenu />);

      await hoverOpenSubmenu();

      await userEvent.hover(screen.getByText('Space'));

      await waitFor(() => {
        expect(screen.queryByText('Table')).toBeNull();
      });
    });

    it('stays open while its own items are hovered', async () => {
      render(<SearchableSubmenu />);

      await hoverOpenSubmenu();

      expect(screen.getByText('Table')).toBeInTheDocument();
    });

    it('stays open when its trigger is hovered again', async () => {
      render(<SearchableSubmenu />);

      await hoverOpenSubmenu();

      await userEvent.hover(screen.getByText('Data view'));

      expect(screen.getByText('Table')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('highlights the trigger in its place among the menu items', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));

      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Group']);

      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Space']);

      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Data view']);

      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Database']);
    });

    it('keeps the trigger in place once a search is cleared', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));

      // Searching unmounts the submenu, which mounting again would
      // otherwise register at the end of the menu.
      await userEvent.type(screen.getByRole('textbox'), 'data');
      await userEvent.clear(screen.getByRole('textbox'));
      await screen.findByText('Group');

      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

      expect(highlighted()).toEqual(['Data view']);
    });

    it('opens the submenu from its trigger', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

      await screen.findByText('Table');
    });

    it('navigates the open submenu rather than the menu', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
      await screen.findByText('Table');

      // The submenu's first item is highlighted as it opens
      await waitFor(() => {
        expect(highlighted()).toEqual(['Table']);
      });

      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Board']);

      // The menu's own items are out of reach until it closes
      await userEvent.keyboard('{ArrowDown}');
      expect(highlighted()).toEqual(['Table']);
    });

    it('selects an item of the open submenu', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
      await screen.findByText('Table');

      await userEvent.keyboard('{Enter}');

      expect(onSelectTable).toHaveBeenCalled();
    });

    it('opens the submenu with the right arrow key', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}');

      await screen.findByText('Table');
    });

    it('leaves the submenu with the left arrow key', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}');
      await screen.findByText('Table');

      await userEvent.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(screen.queryByText('Table')).toBeNull();
      });

      // The highlight returns to the item the submenu was entered
      // from, rather than the menu being left with none.
      await waitFor(() => {
        expect(highlighted()).toEqual(['Data view']);
      });
    });

    it('carries on from the trigger once the submenu is left', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowRight}');
      await screen.findByText('Table');

      await userEvent.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(screen.queryByText('Table')).toBeNull();
      });

      await userEvent.keyboard('{ArrowDown}');

      expect(highlighted()).toEqual(['Database']);
    });

    it('leaves the submenu on escape', async () => {
      render(<SearchableSubmenu />);

      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
      await screen.findByText('Table');

      await userEvent.keyboard('{Escape}');

      // The submenu closes, leaving the menu itself open with its
      // highlight back on the item the submenu was entered from.
      await waitFor(() => {
        expect(screen.queryByText('Table')).toBeNull();
      });
      expect(screen.getByText('Database')).toBeInTheDocument();

      await waitFor(() => {
        expect(highlighted()).toEqual(['Data view']);
      });
    });
  });
});
