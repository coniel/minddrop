import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { ContentViewTypes, ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  DragSource,
  dragAndDrop,
  dropNative,
} from '@minddrop/drag-and-drop/test-utils';
import { ContentViewRenderer } from '@minddrop/feature-content-views';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import {
  AddContentDataKey,
  DatabaseEntriesDataKey,
} from '@minddrop/ui-databases';
import { BoardViewType } from '../BoardViewType';
import { defaultBoardViewData } from '../constants';
import { cleanup, setup } from '../test-utils';
import { BoardViewData } from '../types';
import { BoardViewComponent } from './BoardView';

const { collection_1 } = CollectionFixtures;
const { contentView_board_1 } = ContentViewFixtures;
const {
  objectDatabase,
  objectEntry1,
  rootStorageDatabase,
  validImagePropertyFile,
} = DatabaseFixtures;

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

  afterEach(async () => {
    ContentViewTypes.unregister(BoardViewType.type);
    await cleanup();
  });

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
   * Returns the board's persisted columns.
   *
   * @returns The board's columns.
   */
  function columns() {
    return (ContentViews.get(view.id).data as BoardViewData).columns;
  }

  /**
   * Returns the entries persisted in the board's first column.
   */
  function firstColumn() {
    return columns()[0];
  }

  /**
   * Returns the gap zone at a position within a column.
   *
   * @param columnIndex - The index of the column.
   * @param gapIndex - The position of the gap within the column.
   * @returns The gap zone element.
   */
  function columnGap(columnIndex: number, gapIndex: number): Element {
    const columnElements = document.querySelectorAll(
      '.board-view-column-content',
    );

    return columnElements[columnIndex].querySelector(
      `[data-gap-zone][data-position="${gapIndex}"]`,
    )!;
  }

  /**
   * Returns the gap zone between the board's columns at a position.
   *
   * @param gapIndex - The position of the gap between the columns.
   * @returns The gap zone element.
   */
  function layoutGap(gapIndex: number): Element {
    return document.querySelector(
      `.board-view > [data-gap-zone][data-position="${gapIndex}"]`,
    )!;
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

  it('places an entry dropped on a column and adds it to the collection', async () => {
    // Render the board inside the renderer. The renderer adds dropped
    // entries to the collection.
    ContentViewTypes.register(BoardViewType);
    render(
      <>
        <ContentViewRenderer view={view} entries={[]} />
        <DragSource data={{ [DatabaseEntriesDataKey]: [recentEntry] }} />
      </>,
    );

    dragAndDrop(screen.getByTestId('drag-source'), columnGap(1, 0));

    await waitFor(() => {
      expect(Collections.get(collection.id).items).toEqual([recentEntry.id]);
    });
    expect(columns()).toEqual([[], [recentEntry.id], []]);
  });

  describe('content dropped from outside the app', () => {
    // Two files, each becoming an entry
    const files = [validImagePropertyFile, validImagePropertyFile];

    beforeEach(() => {
      // Send images to a database which can hold them
      Databases.setContentDefault('image', rootStorageDatabase.id);
    });

    it('fills consecutive slots of the column from the drop position', async () => {
      // Seed the first column with an entry, so the drop at its top
      // has to land before it.
      Collections.Store.load([{ ...collection, items: [recentEntry.id] }]);
      render(<BoardViewComponent view={view} entries={[recentEntry.id]} />);

      dropNative(columnGap(0, 0), {}, { files });

      await waitFor(() => {
        expect(Collections.get(collection.id).items).toHaveLength(3);
      });

      const createdIds = Collections.get(collection.id).items.filter(
        (entryId) => entryId !== recentEntry.id,
      );

      expect(firstColumn()).toEqual([...createdIds, recentEntry.id]);
    });

    it('fills a new column for a drop between columns', async () => {
      render(<BoardViewComponent view={view} entries={[]} />);

      dropNative(layoutGap(1), {}, { files });

      await waitFor(() => {
        expect(Collections.get(collection.id).items).toHaveLength(2);
      });
      expect(columns()).toEqual([
        [],
        Collections.get(collection.id).items,
        [],
        [],
      ]);
    });
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
