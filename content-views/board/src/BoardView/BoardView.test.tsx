import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { DragSource, dragAndDrop } from '@minddrop/drag-and-drop/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { AddContentDataKey } from '@minddrop/ui-databases';
import { defaultBoardViewData } from '../constants';
import { cleanup, setup } from '../test-utils';
import { BoardViewData } from '../types';
import { BoardViewComponent } from './BoardView';

const { collection_1 } = CollectionFixtures;
const { contentView_board_1 } = ContentViewFixtures;
const { objectDatabase, objectEntry1 } = DatabaseFixtures;

// A board of an empty collection, so its columns are empty
const collection = { ...collection_1, items: [] };
const view = {
  ...contentView_board_1,
  dataSource: { type: 'collection' as const, id: collection.id },
  data: defaultBoardViewData,
};

// An entry modified after everything the fixtures carry, so the
// picker lists it among the recent entries.
const recentEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_recent',
  title: 'Recent entry',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

describe('<BoardViewComponent />', () => {
  beforeEach(() => {
    setup();

    Collections.Store.load([collection]);
    ContentViews.Store.load([view]);
    DatabaseEntries.Store.load([recentEntry]);
  });

  afterEach(cleanup);

  /**
   * Renders the board and drops the add content card on its first
   * column, opening the picker there.
   */
  function openPicker() {
    render(
      <>
        <BoardViewComponent view={view} entries={[]} />
        <DragSource data={{ [AddContentDataKey]: true }} />
      </>,
    );

    dragAndDrop(
      screen.getByTestId('drag-source'),
      document.querySelector('.board-view-column-content')!,
    );
  }

  /**
   * Returns the entries persisted in the board's first column.
   */
  function firstColumn() {
    return (ContentViews.get(view.id).data as BoardViewData).columns[0];
  }

  it('places a picked entry at the drop position and adds it to the collection', async () => {
    openPicker();

    await userEvent.click(await screen.findByText(recentEntry.title));

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(firstColumn()).toEqual([recentEntry.id]);
  });

  it('places an entry created from a picked database and adds it to the collection', async () => {
    openPicker();

    await userEvent.click(await screen.findByText(objectDatabase.entryName));

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toHaveLength(1);
    });

    const [createdId] = Collections.get(collection.id).items;

    expect(DatabaseEntries.get(createdId).database).toBe(objectDatabase.id);
    expect(firstColumn()).toEqual([createdId]);
  });

  it('keeps the picker open after a shift-picked entry', async () => {
    const user = userEvent.setup();

    openPicker();

    await user.keyboard('{Shift>}');
    await user.click(await screen.findByText(recentEntry.title));
    await user.keyboard('{/Shift}');

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(firstColumn()).toEqual([recentEntry.id]);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
