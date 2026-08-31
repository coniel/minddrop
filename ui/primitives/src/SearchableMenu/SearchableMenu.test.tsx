import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
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
