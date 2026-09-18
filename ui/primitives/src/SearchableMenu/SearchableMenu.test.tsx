import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
} from '../DropdownMenu';
import { MenuGroup } from '../Menu/MenuGroup';
import { MenuLabel } from '../Menu/MenuLabel';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { SearchableMenu } from './SearchableMenu';
import { SearchableMenuItem } from './SearchableMenuItem';

// Types a query into the menu's search field
async function search(query: string) {
  await userEvent.type(screen.getByRole('textbox'), query);
}

describe('SearchableMenu', () => {
  afterEach(cleanup);

  it('lists the items matching the search term', async () => {
    render(
      <SearchableMenu>
        <SearchableMenuItem stringLabel="Apple" onSelect={vi.fn()} />
        <SearchableMenuItem stringLabel="Banana" onSelect={vi.fn()} />
      </SearchableMenu>,
    );

    await search('Ban');

    await waitFor(() => {
      expect(listedItems('Banana')).toHaveLength(1);
      expect(listedItems('Apple')).toHaveLength(0);
    });
  });

  it('lists every item sharing a matched label', async () => {
    render(
      <SearchableMenu>
        <SearchableMenuItem
          stringLabel="Apple"
          stringDescription="First apple"
          onSelect={vi.fn()}
        />
        <SearchableMenuItem
          stringLabel="Apple"
          stringDescription="Second apple"
          onSelect={vi.fn()}
        />
      </SearchableMenu>,
    );

    await search('App');

    // Both items are listed rather than the first one twice
    await waitFor(() => {
      expect(listedItems('First apple')).toHaveLength(1);
      expect(listedItems('Second apple')).toHaveLength(1);
    });
  });

  it('keeps an item trailing content when listing it from the registry', async () => {
    render(
      <SearchableMenu>
        <SearchableMenuItem
          stringLabel="Apple"
          trailingIcon={<span>picked</span>}
          onSelect={vi.fn()}
        />
        <SearchableMenuItem stringLabel="Banana" onSelect={vi.fn()} />
      </SearchableMenu>,
    );

    // Searching hands the rendering of the items to the menu, which
    // rebuilds them from what they registered.
    await search('App');

    // The menu keeps a hidden copy of every item for registration,
    // so the listed one is the copy under test
    await waitFor(() => expect(listedItems('picked')).toHaveLength(1));
  });

  it('lists the given items as they are when the search term is controlled', async () => {
    // A menu which owns the search term matches its items itself.
    // It lists what it renders rather than what registered.
    render(
      <SearchableMenu searchTerm="Ban" onSearchTermChange={vi.fn()}>
        <MenuGroup>
          <MenuLabel stringLabel="Fruit" />
          <SearchableMenuItem stringLabel="Banana" onSelect={vi.fn()} />
        </MenuGroup>
      </SearchableMenu>,
    );

    await waitFor(() => {
      expect(listedItems('Banana')).toHaveLength(1);
      expect(listedItems('Fruit')).toHaveLength(1);
    });
  });

  it('closes the whole menu when a submenu item is selected', async () => {
    render(
      <DropdownMenu trigger={<button>Open</button>}>
        <DropdownSubmenu>
          <DropdownSubmenuTriggerItem stringLabel="Fruit" />
          <DropdownMenuPortal>
            <DropdownMenuPositioner>
              <DropdownSubmenuContent searchable>
                <SearchableMenuItem stringLabel="Apple" onSelect={vi.fn()} />
              </DropdownSubmenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownSubmenu>
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByText('Open'));
    await userEvent.click(await screen.findByText('Fruit'));
    await userEvent.click(await screen.findByText('Apple'));

    // The root menu closes along with the submenu
    await waitFor(() => {
      expect(screen.queryByText('Fruit')).toBeNull();
    });
  });

  it('reports a close it asked for rather than a keyboard one', async () => {
    let closeReason: string | undefined;

    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        searchable
        onOpenChange={(open, eventDetails) => {
          if (!open) {
            closeReason = eventDetails.reason;
          }
        }}
      >
        <SearchableMenuItem stringLabel="Apple" onSelect={vi.fn()} />
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByText('Open'));
    await userEvent.click(await screen.findByText('Apple'));

    await waitFor(() => expect(closeReason).toBe('imperative-action'));
  });

  it('closes the popover it is rendered in', async () => {
    let closeReason: string | undefined;

    render(
      <Popover
        onOpenChange={(open, eventDetails) => {
          if (!open) {
            closeReason = eventDetails.reason;
          }
        }}
      >
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverPositioner>
            <PopoverContent
              render={
                <SearchableMenu>
                  <SearchableMenuItem stringLabel="Apple" onSelect={vi.fn()} />
                </SearchableMenu>
              }
            />
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>,
    );

    await userEvent.click(screen.getByText('Open'));
    await userEvent.click(await screen.findByText('Apple'));

    await waitFor(() => {
      expect(screen.queryByText('Apple')).toBeNull();
    });

    expect(closeReason).toBe('imperative-action');
  });
});

/**
 * Returns the listed items matching the label. While searching,
 * the menu keeps a hidden copy of every item for registration and
 * renders the results separately, so hidden copies are dropped.
 */
function listedItems(label: string): HTMLElement[] {
  return screen
    .queryAllByText(label)
    .filter((element) => !element.closest('[hidden]'));
}
